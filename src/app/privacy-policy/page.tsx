
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Learn about how LISGE handles your data and respects your privacy.',
  robots: { // Noindex for placeholder legal pages initially
    index: false,
    follow: false,
  }
};

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-8 prose dark:prose-invert lg:prose-xl max-w-4xl">
      <h1>Privacy Policy</h1>
      <p><em>Last updated: {new Date().toLocaleDateString()}</em></p>
      
      <p>
        Welcome to LISGE (&quot;us&quot;, &quot;we&quot;, or &quot;our&quot;). We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about this privacy notice, or our practices with regards to your personal information, please contact us using the information provided on our Contact page.
      </p>
      
      <div className="p-4 my-6 border-l-4 border-primary bg-primary/10">
        <p className="font-semibold">Important Notice:</p>
        <p>This is a template Privacy Policy and is for informational purposes only. You MUST replace the placeholder text below with your specific privacy policy details. Consult with a legal professional to ensure your policy is compliant with all applicable laws and regulations (e.g., GDPR, CCPA, Egyptian data protection laws).</p>
      </div>

      <h2>1. INFORMATION WE COLLECT</h2>
      <p>[<strong>Placeholder:</strong> Detail the types of personal information you collect. For example: email addresses via the contact link, usage data through website analytics if implemented, cookies, etc. Specify if you collect it directly or via third parties like analytics services.]</p>
      
      <h2>2. HOW WE USE YOUR INFORMATION</h2>
      <p>[<strong>Placeholder:</strong> Explain how you use the collected information. For example: to respond to inquiries, improve website functionality, analyze website traffic, etc.]</p>
      
      <h2>3. WILL YOUR INFORMATION BE SHARED WITH ANYONE?</h2>
      <p>[<strong>Placeholder:</strong> Describe your information sharing practices. For LISGE, this might be minimal initially. State if you do not share personal information with third parties, except as required by law or with explicit consent. If you use third-party services like analytics, mention data sharing with them.]</p>
      
      <h2>4. COOKIES AND OTHER TRACKING TECHNOLOGIES</h2>
      <p>[<strong>Placeholder:</strong> Explain your use of cookies. If you only use essential cookies for site functionality (e.g., theme preference from next-themes), state that. If you plan to use analytics or other tracking, detail that here and how users can manage cookie preferences.]</p>

      <h2>5. HOW DO WE KEEP YOUR INFORMATION SAFE?</h2>
      <p>[<strong>Placeholder:</strong> Outline the security measures you (and your hosting provider, Firebase) have in place to protect user data. Mention HTTPS, secure hosting environment, etc.]</p>
      
      <h2>6. WHAT ARE YOUR PRIVACY RIGHTS?</h2>
      <p>[<strong>Placeholder:</strong> Inform users about their rights regarding their personal data, such as the right to access, correct, or request deletion of their data, especially relevant if you start collecting more interactive data.]</p>
      
      <h2>7. UPDATES TO THIS NOTICE</h2>
      <p>[<strong>Placeholder:</strong> Explain that this policy may be updated and how users will be informed of significant changes (e.g., by updating the "Last updated" date).]</p>
      
      <h2>8. HOW CAN YOU CONTACT US ABOUT THIS NOTICE?</h2>
      <p>[<strong>Placeholder:</strong> Reiterate that users can contact you via the email provided on the Contact page for any privacy-related questions.]</p>
    </div>
  );
}
