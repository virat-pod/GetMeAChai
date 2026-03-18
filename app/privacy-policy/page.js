const Privacy = () => {
  return (
    <div className="min-h-screen bg-stone-50 py-16 pt-22 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-10">
          <span className="text-xs font-semibold text-amber-500 tracking-widest uppercase">
            Legal
          </span>
          <h1 className="text-3xl font-bold text-stone-900 mt-1">
            Privacy Policy
          </h1>
          <p className="text-stone-400 text-sm mt-1">
            Last updated: March 2026
          </p>
        </div>

        <div className="flex flex-col gap-8 text-stone-600 text-sm leading-relaxed">
          <section>
            <h2 className="text-base font-bold text-stone-800 mb-2">
              1. What We Collect
            </h2>
            <p>
              When you sign up, we collect your name, email address, and profile
              picture. When you use Get me a chai ("Buzz"), we also collect
              content you post, accounts you follow, and posts you like or
              interact with.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-stone-800 mb-2">
              2. How We Use Your Data
            </h2>
            <p>
              We use your data to operate the platform — showing your posts,
              building your feed, and displaying your profile. We do not sell
              your personal data to third parties.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-stone-800 mb-2">
              3. Authentication
            </h2>
            <p>
              We use NextAuth for authentication. If you sign in with Google or
              another provider, we only store the information they share with us
              — typically your name, email, and profile picture.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-stone-800 mb-2">
              4. Media Uploads
            </h2>
            <p>
              Images and videos you upload are stored on Cloudinary, a
              third-party media hosting service. By uploading media, you agree
              to their usage terms as well.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-stone-800 mb-2">
              5. Cookies
            </h2>
            <p>
              We use cookies to keep you logged in and to maintain your session.
              We do not use cookies for advertising or tracking across other
              websites.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-stone-800 mb-2">
              6. Data Retention
            </h2>
            <p>
              Your data is retained as long as your account is active. When you
              delete your account, your posts and profile data are permanently
              removed from our database.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-stone-800 mb-2">
              7. Your Rights
            </h2>
            <p>
              You can update or delete your account at any time. If you want a
              copy of your data or have any privacy concerns, contact us at{" "}
              <span className="text-amber-500">viratpod2012@gmail.com</span>
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-stone-800 mb-2">
              8. Changes
            </h2>
            <p>
              We may update this policy occasionally. We'll notify you of
              significant changes via email or a notice on the platform.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
