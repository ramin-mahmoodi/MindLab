import { Brain } from 'lucide-react';

const Footer = () => {
  const footerLinks = {
    Product: ['All Tests', 'Personality', 'IQ Tests', 'Mental Health', 'Pricing'],
    Company: ['About Us', 'Careers', 'Blog', 'Press'],
    Support: ['Help Center', 'Contact', 'Privacy Policy', 'Terms of Service'],
    Connect: ['Twitter', 'LinkedIn', 'Instagram', 'Facebook'],
  };

  return (
    <footer id="contact" className="bg-secondary/30 border-t border-border">
      <div className="container px-4 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <a href="#" className="flex items-center gap-2 mb-4">
              <Brain className="w-7 h-7 text-primary" />
              <span className="text-lg font-display font-bold text-foreground">
                Mind<span className="text-primary">Lab</span>
              </span>
            </a>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Empowering self-discovery through scientifically validated psychological assessments.
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-semibold text-foreground mb-4">{category}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-12 mt-12 border-t border-border">
          <p className="text-sm text-muted-foreground">
            © 2024 MindLab. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Privacy
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Terms
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
