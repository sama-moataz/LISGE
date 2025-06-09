
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Learn about how LISGE handles your data and respects your privacy.',
  robots: { 
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
      <p>We may collect information that you provide to us directly, such as when you contact us via email. We may also collect certain information automatically when you visit, use, or navigate the Website. This information does not reveal your specific identity (like your name or contact information) but may include device and usage information, such as your IP address, browser and device characteristics, operating system, language preferences, referring URLs, device name, country, location, information about how and when you use our Website, and other technical information.</p>
      
      <h2>2. HOW WE USE YOUR INFORMATION</h2>
      <p>[<strong>Placeholder:</strong> Explain how you use the collected information. For example: to respond to inquiries, improve website functionality, analyze website traffic, etc.]</p>
      <p>We use personal information collected via our Website for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations. We indicate the specific processing grounds we rely on next to each purpose listed below.
        <ul>
          <li><strong>To respond to user inquiries/offer support to users.</strong> We may use your information to respond to your inquiries and solve any potential issues you might have with the use of our Services.</li>
          <li><strong>To manage user preferences.</strong> We use localStorage (a type of web storage) to remember your site preferences, such as your chosen theme (light or dark mode). This is done to enhance your user experience.</li>
          <li><strong>For other Business Purposes.</strong> We may use your information for other Business Purposes, such as data analysis, identifying usage trends, determining the effectiveness of our promotional campaigns and to evaluate and improve our Website, products, marketing and your experience.</li>
        </ul>
      </p>
      
      <h2>3. WILL YOUR INFORMATION BE SHARED WITH ANYONE?</h2>
      <p>[<strong>Placeholder:</strong> Describe your information sharing practices. For LISGE, this might be minimal initially. State if you do not share personal information with third parties, except as required by law or with explicit consent. If you use third-party services like analytics, mention data sharing with them.]</p>
      <p>We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations. We do not currently share your personal information with third-party advertisers.</p>
      
      <h2>4. COOKIES AND OTHER TRACKING TECHNOLOGIES</h2>
      <p>
        We use client-side storage technologies, such as <strong>localStorage</strong>, to enhance your experience on our website. LocalStorage allows us to remember your preferences, such as your selected theme (light or dark mode), so you don’t have to set it on each visit. This is essential for the site's user experience.
      </p>
      <p>
        Unlike traditional cookies that are sent with every HTTP request, localStorage data is stored locally in your browser and is not automatically transmitted to our servers.
      </p>
      <p>
        [<strong>Placeholder:</strong> If you plan to use other cookies, for example, for analytics (like Google Analytics) or other third-party services in the future, you should detail that usage here. Explain what types of cookies they are (e.g., performance, functional, targeting), what data they collect, and how users can manage their preferences (e.g., through browser settings or a cookie consent tool). Be transparent about any third-party cookies.]
      </p>
      <p>
        You can typically manage or delete localStorage through your browser settings. Please refer to your browser's help documentation for instructions on how to do this. Note that clearing localStorage may reset your site preferences, such as your theme choice.
      </p>

      <h2>5. HOW DO WE KEEP YOUR INFORMATION SAFE?</h2>
      <p>[<strong>Placeholder:</strong> Outline the security measures you (and your hosting provider, Firebase) have in place to protect user data. Mention HTTPS, secure hosting environment, etc.]</p>
      <p>We aim to protect your personal information through a system of organizational and technical security measures. We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. For example, our website is served over HTTPS. However, despite our safeguards and efforts to secure your information, no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure, so we cannot promise or guarantee that hackers, cybercriminals, or other unauthorized third parties will not be able to defeat our security, and improperly collect, access, steal, or modify your information. Although we will do our best to protect your personal information, transmission of personal information to and from our Website is at your own risk. You should only access the Website within a secure environment.</p>
      
      <h2>6. WHAT ARE YOUR PRIVACY RIGHTS?</h2>
      <p>[<strong>Placeholder:</strong> Inform users about their rights regarding their personal data, such as the right to access, correct, or request deletion of their data, especially relevant if you start collecting more interactive data.]</p>
      <p>Depending on your location, you may have certain rights regarding your personal information under applicable data protection laws. These may include the right (i) to request access and obtain a copy of your personal information, (ii) to request rectification or erasure; (iii) to restrict the processing of your personal information; and (iv) if applicable, to data portability. In certain circumstances, you may also have the right to object to the processing of your personal information. To make such a request, please use the contact details provided on our Contact page.</p>
      
      <h2>7. UPDATES TO THIS NOTICE</h2>
      <p>We may update this privacy notice from time to time. The updated version will be indicated by an updated "Last updated" date and the updated version will be effective as soon as it is accessible. If we make material changes to this privacy notice, we may notify you either by prominently posting a notice of such changes or by directly sending you a notification. We encourage you to review this privacy notice frequently to be informed of how we are protecting your information.</p>
      
      <h2>8. HOW CAN YOU CONTACT US ABOUT THIS NOTICE?</h2>
      <p>If you have questions or comments about this notice, you may email us using the contact details provided on our Contact page.</p>
    </div>
  );
}
