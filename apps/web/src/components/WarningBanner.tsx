interface WarningBannerProps {
    message?: string;
}

export default function WarningBanner({ message }: WarningBannerProps) {
    return (
        <div className="alert alert-warning">
            <span className="alert-icon">⚠️</span>
            <div>
                <strong>هشدار مهم</strong>
                <p style={{ marginBottom: 0 }}>
                    {message || 'این تست صرفاً جنبه آموزشی و غربالگری دارد و جایگزین تشخیص پزشکی یا روان‌پزشکی نیست. در صورت نگرانی حتماً با متخصص مشورت کنید.'}
                </p>
            </div>
        </div>
    );
}
