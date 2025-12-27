import { getIdToken } from './firebase';

const API_BASE = '/api';

interface ApiOptions {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    body?: any;
    requireAuth?: boolean;
}

async function apiCall<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
    const { method = 'GET', body, requireAuth = true } = options;

    const headers: Record<string, string> = {
        'Content-Type': 'application/json'
    };

    if (requireAuth) {
        const token = await getIdToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
    }

    // Retry logic for transient errors
    const maxRetries = 3;
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const response = await fetch(`${API_BASE}${endpoint}`, {
                method,
                headers,
                body: body ? JSON.stringify(body) : undefined
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'API request failed');
            }

            return data;
        } catch (error) {
            lastError = error as Error;
            console.error(`API call attempt ${attempt} failed:`, error);

            // Only retry on network errors, not on 4xx errors
            if (attempt < maxRetries) {
                await new Promise(resolve => setTimeout(resolve, 500 * attempt));
            }
        }
    }

    throw lastError || new Error('API request failed after retries');
}

// Types
export interface Test {
    id: number;
    name: string;
    description?: string;
    category?: string;
    warning?: string;
}

export interface Question {
    id: number;
    text: string;
    order_index: number;
    options: Option[];
}

export interface Option {
    id: number;
    text: string;
    order_index: number;
}

export interface Session {
    id: number;
    test_id: number;
    test_name: string;
    category?: string;
    created_at: string;
    finished_at?: string;
    total_score?: number;
}

export interface SessionResult {
    scaleName: string;
    score: number;
    interpretation?: string;
}

export interface SessionDetail {
    id: number;
    test_id: number;
    test_name: string;
    test_description?: string;
    category?: string;
    warning?: string;
    created_at: string;
    finished_at?: string;
    totalScore: number;
    report_json?: any;
    results: {
        id: number;
        score: number;
        interpretation?: string;
        scale_name: string;
        scale_description?: string;
    }[];
    answers: {
        id: number;
        score: number;
        question_text: string;
        order_index: number;
        answer_text: string;
    }[];
}

// Public API
export async function getTests(): Promise<Test[]> {
    const data = await apiCall<{ tests: Test[] }>('/tests', { requireAuth: false });
    return data.tests;
}

export async function getTest(id: number): Promise<{ test: Test & { questions: Question[] } }> {
    return apiCall(`/tests/${id}`, { requireAuth: false });
}

// User API
export async function startSession(testId: number): Promise<{ sessionId: number; questions: Question[] }> {
    return apiCall('/sessions/start', { method: 'POST', body: { testId } });
}

export async function submitAnswer(sessionId: number, questionId: number, optionId: number): Promise<{ success: boolean }> {
    return apiCall('/sessions/answer', {
        method: 'POST',
        body: { sessionId, questionId, optionId }
    });
}

export async function finishSession(sessionId: number): Promise<{ success: boolean; totalScore: number; results: SessionResult[] }> {
    return apiCall('/sessions/finish', { method: 'POST', body: { sessionId } });
}

export async function getMySessions(): Promise<Session[]> {
    const data = await apiCall<{ sessions: Session[] }>('/me/sessions');
    return data.sessions;
}

export async function getSessionDetail(sessionId: number): Promise<SessionDetail> {
    const data = await apiCall<{ session: SessionDetail }>(`/me/sessions/${sessionId}`);
    return data.session;
}

// Admin API
export async function adminGetTests(): Promise<Test[]> {
    const data = await apiCall<{ tests: Test[] }>('/admin/tests');
    return data.tests;
}

export async function adminCreateTest(test: Omit<Test, 'id'>): Promise<{ success: boolean; id: number }> {
    return apiCall('/admin/tests', { method: 'POST', body: test });
}

export async function adminUpdateTest(test: Test): Promise<{ success: boolean }> {
    return apiCall('/admin/tests', { method: 'PUT', body: test });
}

export async function adminDeleteTest(id: number): Promise<{ success: boolean }> {
    return apiCall(`/admin/tests?id=${id}`, { method: 'DELETE' });
}

export async function adminGetQuestions(testId: number): Promise<{ questions: any[]; scales: any[] }> {
    return apiCall(`/admin/questions?testId=${testId}`);
}

export async function adminCreateQuestion(question: { testId: number; text: string; orderIndex?: number; scaleIds?: number[] }): Promise<{ success: boolean; id: number }> {
    return apiCall('/admin/questions', { method: 'POST', body: question });
}

export async function adminUpdateQuestion(question: { id: number; text: string; orderIndex?: number; scaleIds?: number[] }): Promise<{ success: boolean }> {
    return apiCall('/admin/questions', { method: 'PUT', body: question });
}

export async function adminDeleteQuestion(id: number): Promise<{ success: boolean }> {
    return apiCall(`/admin/questions?id=${id}`, { method: 'DELETE' });
}

export async function adminCreateOption(option: { questionId: number; text: string; score: number; orderIndex?: number }): Promise<{ success: boolean; id: number }> {
    return apiCall('/admin/options', { method: 'POST', body: option });
}

export async function adminUpdateOption(option: { id: number; text: string; score: number; orderIndex?: number }): Promise<{ success: boolean }> {
    return apiCall('/admin/options', { method: 'PUT', body: option });
}

export async function adminDeleteOption(id: number): Promise<{ success: boolean }> {
    return apiCall(`/admin/options?id=${id}`, { method: 'DELETE' });
}

export async function adminImport(data: any): Promise<{ success: boolean; results: any }> {
    return apiCall('/admin/import', { method: 'POST', body: data });
}

export async function adminExport(): Promise<any> {
    return apiCall('/admin/export');
}

// AI Analysis
export async function getAiAnalysis(sessionId: number): Promise<{ success: boolean; analysis: string; model: string }> {
    return apiCall('/ai/analyze', { method: 'POST', body: { sessionId } });
}
