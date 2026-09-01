/* =============================================================
   SITE CONFIGURATION
   -------------------------------------------------------------
   This is the ONLY file you need to touch to wire up the contact
   form. Everything here is safe to expose publicly — never put a
   private API key, password or secret token in this file (or in
   any other file inside /js, /css or index.html). Those are all
   downloaded by the visitor's browser and are readable by anyone.
   ============================================================= */

window.SITE_CONFIG = {

  /* -----------------------------------------------------------
     CONTACT FORM ENDPOINT
     -----------------------------------------------------------
     Paste the URL of a static-site form service here to make the
     "Send Message" button deliver real email to your inbox.

     Tested / supported services (all have a free tier, and the
     value below is a PUBLIC id — safe to commit and deploy):

       Formspree   https://formspree.io/f/XXXXXXXX
       Web3Forms   https://api.web3forms.com/submit
       Netlify     leave this empty and follow README.md instead

     While this is left as an empty string the form stays fully
     honest: it validates your visitor's input, then hands the
     message off to their own email client pre-filled and
     addressed to you. It will never claim a message was sent
     when nothing was actually sent.
     ----------------------------------------------------------- */
  contactEndpoint: '',

  /* Only needed for Web3Forms. This "access key" is designed to be
     public — it is not a secret. Leave empty for every other
     service. */
  web3formsAccessKey: '',

  /* Where messages should end up. Also powers the "Email Me"
     button and the mailto fallback described above. */
  email: 'raviprakash0948@gmail.com',

  /* International format, digits only — used to build the
     wa.me link. 91 = India country code. */
  whatsapp: '919964705686',
  whatsappDisplay: '+91 99647 05686',
  whatsappMessage: 'Hi Raviprakash, I came across your portfolio and would like to connect with you.',

  linkedin: 'https://www.linkedin.com/in/raviprakash-k-69bb7b259',
  linkedinDisplay: 'linkedin.com/in/raviprakash-k-69bb7b259'
};
