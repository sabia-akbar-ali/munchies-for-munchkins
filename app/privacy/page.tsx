export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen py-12 px-6" style={{ background: "#fffbf5" }}>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-black text-orange-500 mb-2">Privacy Policy</h1>
        <p className="text-sm text-gray-400 mb-8">Last updated: June 2026 · Little Bites Studio · littlebitesstudio88@gmail.com</p>

        <div className="space-y-6 text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-xl font-black text-gray-800 mb-2">Introduction</h2>
            <p>Munchies for Munchkins is an AI-powered recipe generator for parents and carers of babies and toddlers aged 6 months to 5 years. This app is designed to be used by adults, not children. By using this app, you agree to this privacy policy.</p>
          </section>

          <section>
            <h2 className="text-xl font-black text-gray-800 mb-2">What Information We Collect</h2>
            <p>When you use Munchies for Munchkins, you provide the following information to generate a recipe:</p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>Ingredients you have at home</li>
              <li>Your child&apos;s age range</li>
              <li>Texture preference</li>
              <li>Any allergen requirements (e.g. nut-free, dairy-free)</li>
              <li>Whether you require halal ingredients</li>
            </ul>
            <p className="mt-2">This information is entered by you each time you use the app. It is not linked to your identity, and we do not create a profile of you or your child.</p>
          </section>

          <section>
            <h2 className="text-xl font-black text-gray-800 mb-2">How We Use Your Information</h2>
            <p>The information you enter is sent to the Anthropic Claude AI system to generate a recipe. Once the recipe is returned to you, the information is discarded. We do not store your inputs on our servers.</p>
          </section>

          <section>
            <h2 className="text-xl font-black text-gray-800 mb-2">Third Parties</h2>
            <p>We use Anthropic&apos;s Claude AI to generate recipes. When you submit a request, your inputs are sent to Anthropic&apos;s systems to process your request. Anthropic has its own privacy policy which you can read at anthropic.com/privacy.</p>
            <p className="mt-2">We do not share your information with any other third parties. We do not sell your data. Ever.</p>
          </section>

          <section>
            <h2 className="text-xl font-black text-gray-800 mb-2">Cookies and Tracking</h2>
            <p>We do not use cookies. We do not track your behaviour. We do not use advertising networks or analytics tools that collect personal information.</p>
          </section>

          <section>
            <h2 className="text-xl font-black text-gray-800 mb-2">Children&apos;s Privacy</h2>
            <p>Munchies for Munchkins is designed to be used by parents and carers, not by children. We do not knowingly collect personal information from children. The dietary information entered relates to your child but is not personally identifiable and is not stored.</p>
            <p className="mt-2">If you believe your child has provided personal information through this app, please contact us at littlebitesstudio88@gmail.com and we will take steps to remove it.</p>
          </section>

          <section>
            <h2 className="text-xl font-black text-gray-800 mb-2">Data Security</h2>
            <p>Because we do not store your data, there is no database of personal information that could be breached. Recipe requests are processed in real time and discarded immediately after.</p>
          </section>

          <section>
            <h2 className="text-xl font-black text-gray-800 mb-2">Changes to This Policy</h2>
            <p>We may update this privacy policy from time to time. Any changes will be reflected in an updated version within the app and on our store listing.</p>
          </section>

          <section>
            <h2 className="text-xl font-black text-gray-800 mb-2">Contact Us</h2>
            <p>If you have any questions about this privacy policy, please contact us at:</p>
            <p className="mt-2 font-semibold">littlebitesstudio88@gmail.com<br />Little Bites Studio</p>
          </section>
        </div>

        <div className="mt-10 pt-6 border-t border-orange-100">
          <a href="/" className="text-orange-400 font-bold text-sm">← Back to app</a>
        </div>
      </div>
    </div>
  );
}
