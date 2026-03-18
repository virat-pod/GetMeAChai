const Terms = () => {
  return (
    <div className="min-h-screen bg-stone-50 py-16 pt-22 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-10">
          <span className="text-xs font-semibold text-amber-500 tracking-widest uppercase">
            Legal
          </span>
          <h1 className="text-3xl font-bold text-stone-900 mt-1">
            Terms of Service
          </h1>
          <p className="text-stone-400 text-sm mt-1">
            Last updated: March 2026
          </p>
        </div>

        <div className="flex flex-col gap-8 text-stone-600 text-sm leading-relaxed">
          <section>
            <h2 className="text-base font-bold text-stone-800 mb-2">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing or using Get Me a Chai ("Buzz"), you agree to be
              bound by these Terms of Service. If you do not agree, please do
              not use our platform.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-stone-800 mb-2">
              2. Your Account
            </h2>
            <p>
              You are responsible for maintaining the confidentiality of your
              account credentials. You agree to provide accurate information
              when signing up and to keep your profile up to date. You must be
              at least 13 years old to use Buzz.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-stone-800 mb-2">
              3. Content You Post
            </h2>
            <p>
              You retain ownership of the content you post on Buzz. By posting,
              you grant us a non-exclusive license to display your content on
              the platform. You are solely responsible for what you post — do
              not share anything illegal, hateful, or harmful.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-stone-800 mb-2">
              4. PRO Badge
            </h2>
            <p>
              The PRO badge is awarded to users who reach 10 posts on the
              platform. This is a recognition feature and does not confer any
              monetary value or special privileges beyond visual distinction.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-stone-800 mb-2">
              5. Prohibited Conduct
            </h2>
            <p>
              You agree not to spam, harass, impersonate other users, or attempt
              to gain unauthorized access to any part of the platform. We
              reserve the right to suspend or terminate accounts that violate
              these terms.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-stone-800 mb-2">
              6. Termination
            </h2>
            <p>
              We may suspend or delete your account at any time if we believe
              you have violated these terms. You may also delete your account at
              any time from your settings.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-stone-800 mb-2">
              7. Changes to Terms
            </h2>
            <p>
              We may update these terms from time to time. Continued use of Get me a chai
              after changes means you accept the new terms.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-stone-800 mb-2">
              8. Contact
            </h2>
            <p>
              Questions? Reach us at{" "}
              <span className="text-amber-500">viratpod2012@gmail.com</span>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Terms;
