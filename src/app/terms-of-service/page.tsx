
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Read the Terms of Service for using the LISGE website.',
  robots: { // Noindex for placeholder legal pages initially
    index: false,
    follow: false,
  }
};

export default function TermsOfServicePage() {
  return (
    <div className="container mx-auto px-4 py-8 prose dark:prose-invert lg:prose-xl max-w-4xl">
      <h1>Terms of Service</h1>
      <p><em>Last updated: {new Date().toLocaleDateString()}</em></p>

      <p>Please read these Terms of Service (&quot;Terms&quot;, &quot;Terms of Service&quot;) carefully before using the LISGE website (the &quot;Service&quot;) operated by LISGE (&quot;us&quot;, &quot;we&quot;, or &quot;our&quot;).</p>
      
      <div className="p-4 my-6 border-l-4 border-primary bg-primary/10">
        <p className="font-semibold">Important Notice:</p>
        <p>This is a template Terms of Service and is for informational purposes only. You MUST replace the placeholder text below with your specific terms. Consult with a legal professional to ensure your Terms of Service are appropriate for your website and compliant with all applicable laws.</p>
      </div>

      <h2>1. Acceptance of Terms</h2>
      <p>[<strong>Placeholder:</strong> By accessing or using the Service, you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the Service.]</p>

      <h2>2. Content</h2>
      <p>[<strong>Placeholder:</strong> Our Service allows you to access information about scholarships, study tips, summer programs, volunteer opportunities, and pre-college courses. The information provided is for general guidance only. We strive to keep information accurate and up-to-date, but we make no warranties or guarantees about the completeness, accuracy, reliability, suitability, or availability of any information on the Service. Any reliance you place on such information is strictly at your own risk.]</p>
      <p>[<strong>Placeholder:</strong> You may not use the content for any commercial purpose without express written consent from us. You may not reproduce, distribute, modify, create derivative works of, publicly display, publicly perform, republish, download, store, or transmit any of the material on our Website, except as follows: your computer may temporarily store copies of such materials in RAM incidental to your accessing and viewing those materials.]</p>
      
      <h2>3. Intellectual Property</h2>
      <p>[<strong>Placeholder:</strong> The Service and its original content (excluding content provided by users, if any), features, and functionality are and will remain the exclusive property of LISGE and its licensors. The Service is protected by copyright, trademark, and other laws of both Egypt and foreign countries.]</p>

      <h2>4. Links To Other Web Sites</h2>
      <p>[<strong>Placeholder:</strong> Our Service may contain links to third-party web sites or services that are not owned or controlled by LISGE. LISGE has no control over, and assumes no responsibility for, the content, privacy policies, or practices of any third party web sites or services. You further acknowledge and agree that LISGE shall not be responsible or liable, directly or indirectly, for any damage or loss caused or alleged to be caused by or in connection with use of or reliance on any such content, goods or services available on or through any such web sites or services.]</p>

      <h2>5. Limitation Of Liability</h2>
      <p>[<strong>Placeholder:</strong> In no event shall LISGE, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) your access to or use of or inability to access or use the Service; (ii) any conduct or content of any third party on the Service; (iii) any content obtained from the Service; and (iv) unauthorized access, use or alteration of your transmissions or content, whether based on warranty, contract, tort (including negligence) or any other legal theory, whether or not we have been informed of the possibility of such damage, and even if a remedy set forth herein is found to have failed of its essential purpose.]</p>

      <h2>6. Disclaimer</h2>
      <p>[<strong>Placeholder:</strong> Your use of the Service is at your sole risk. The Service is provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis. The Service is provided without warranties of any kind, whether express or implied, including, but not limited to, implied warranties of merchantability, fitness for a particular purpose, non-infringement or course of performance.]</p>
      
      <h2>7. Governing Law</h2>
      <p>[<strong>Placeholder:</strong> These Terms shall be governed and construed in accordance with the laws of Egypt, without regard to its conflict of law provisions.]</p>
      
      <h2>8. Changes</h2>
      <p>[<strong>Placeholder:</strong> We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will try to provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.]</p>
      
      <h2>9. Contact Us</h2>
      <p>[<strong>Placeholder:</strong> If you have any questions about these Terms, please contact us via the information on our Contact page.]</p>
    </div>
  );
}
