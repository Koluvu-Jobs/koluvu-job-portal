# This repository is connected to the koluvu_job-portal GitHub

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

### First we are going to create nextjs app

- so we should create an empty folder in that folder we should open our command prompt.
- After opening command prompt:
- **Command 1:**

  ```bash
  npx create-next-app@latest koluvu-app
  ```

  1️⃣ It will be asking us like you want typescript (Yes/ No): **Yes**

  2️⃣ It will be asking us if we want ESLint (Yes/No): **Yes**

  3️⃣ It will be asking us if we want Tailswind.css (Yes/No): **Yes**

  4️⃣ It will be asking us to give code inside '.src/' folder: **Yes**

  5️⃣ It will ask if we want AppRouter (Yes/No): **Yes**

  6️⃣ It will ask if we want TurboPack (Yes/No): **Yes**

  7️⃣ It will ask if we want to customize the import alias (Yes/No): **Yes**

  8️⃣ It will ask us to enter our customized alias name: **@koluvu/**

---

### Next we just need one package for now that is: react-icons

- steps to install react-icons:

  - **STEP 1:** Go to the folder where package.json is present in our case it wil be present in `koluvu-app` if your project folder name is different then it will be different.

  - **STEP 2:** Command to install react-icons: `npm install react-icons`

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

# 🚀 Koluvu App Project Structure

```
koluvu-app/
│
├── 📂 public                             # 🌐 Public assets folder
│   ├── 🖼️ images/                       # 📷 Images directory
│   └── 🎬 videos/                       # ▶️ Videos directory
│
├── 📂 src                                # 🏗️ Source code folder
│   │
│   ├── 📂 app                           # 🚀 Main application routes & pages
│   │   ├── 📂 about/                    # ℹ️ About section
│   │   │   ├── 📂 FAQ/                  # ❓ Frequently Asked Questions
│   │   │   │   └── 📄 page.js           # 📜 FAQ Page
│   │   │   └── 📄 page.js               # 📜 About Page
│   │   │
│   │   ├── 📂 api/                      # 🌍 API endpoints
│   │   │   ├── 📂 auth/                 # 🔐 Authentication APIs
│   │   │   ├── 📂 jobs/                 # 📝 Job-related APIs
│   │   │   └── 📂 ...                   # ➕ More APIs...
│   │   │
│   │   ├── 📂 auth/                     # 🔐 Authentication module
│   │   │   ├── 📂 login/                # 🔑 Login functionality
│   │   │   │   ├── employee/            # 👨‍💼 Employee login
│   │   │   │   │   ├── 📄 page.js       # 🖥️ Employee login page
│   │   │   │   │   └── 📄 form.js       # 📝 Employee login form
│   │   │   │   │
│   │   │   │   └── employer/            # 🏢 Employer login
│   │   │   │       ├── 📄 page.js       # 🖥️ Employer login page
│   │   │   │       └── 📄 form.js       # 📝 Employer login form
│   │   │   │
│   │   │   └── 📂 register/             # 📋 Registration functionality
│   │   │       ├── 📂 employee/         # 👨‍💼 Employee registration
│   │   │       │   ├── 📄 page.js       # 🖥️ Employee registration page
│   │   │       │   └── 📄 VarificationForm.js # ✅ Verification form
│   │   │       │
│   │   │       ├── 📂 employer/         # 🏢 Employer registration
│   │   │       │   ├── 📄 page.js       # 🖥️ Employer registration page
│   │   │       │   └── 📄 form.js       # 📝 Employer registration form
│   │   │       │
│   │   │       └── 📂 partner/          # 🤝 Partner registration
│   │   │           ├── 📄 page.js       # 🖥️ Partner registration page
│   │   │           └── 📄 form.js       # 📝 Partner registration form
│   │   │
│   │   ├── 📂 companies/                # 🏢 Companies module
│   │   │   ├── 📄 page.js               # 📂 Company directory page
│   │   │   │
│   │   │   ├── 📂 components/           # 🧩 Reusable components
│   │   │   │   ├── 📄 CompanyDirectory.js # 📇 Directory view
│   │   │   │   ├── 📄 CompanyCard.js    # 🃏 Single company card
│   │   │   │   ├── 📄 CompanyModal.js   # 💼 Company details modal
│   │   │   │   ├── 📄 CompanyFilters.js # 🔍 Filters for companies
│   │   │   │   └── 📄 CompanySearch.js  # 🔎 Search bar for companies
│   │   │   │
│   │   │   └── 📂 [id]/                 # 🆔 Dynamic company ID route
│   │   │       └── 📄 page.js           # 🏛️ Individual company page
│   │   │
│   │   ├── 📂 legal/                    # ⚖️ Legal documents
│   │   │   ├── 📂 privacy-policy/       # 🔒 Privacy policy
│   │   │   │   └── 📄 page.js           # 📜 Privacy policy page
│   │   │   │
│   │   │   ├── 📂 terms/                # 📑 Terms of service
│   │   │   │   └── 📄 page.js           # 🖥️ Terms page
│   │   │   │
│   │   │   └── 📂 vulnerability-disclosure-policy/ # 🛡️ VDP
│   │   │       └── 📄 page.js           # 🖥️ Vulnerability disclosure policy page
│   │   │
│   │   ├── 📂 main/                     # 🔒 Main application routes
│   │   │   ├── 📂 dashboard/            # 📊 Dashboard module
│   │   │   │   ├── 📂 employee/         # 👨‍💻 Employee dashboard
│   │   │   │   │   ├── 📄 page.js       # 🖥️ Employee dashboard page
│   │   │   │   │   ├── 📄 overview.js   # 👀 Overview section
│   │   │   │   │   └── 📄 stats.js      # 📈 Statistics section
│   │   │   │   │
│   │   │   │   ├── 📂 employer/         # 👔 Employer dashboard
│   │   │   │   │   ├── active-jobs/     # 📋 Active jobs
│   │   │   │   │   │   ├── active-jobs.js
│   │   │   │   │   │   └── page.js
│   │   │   │   │   │
│   │   │   │   │   ├── ai-candidates/   # 🤖 AI candidates
│   │   │   │   │   │   └── page.js
│   │   │   │   │   │
│   │   │   │   │   ├── ats/             # 📑 Applicant tracking system
│   │   │   │   │   │   └── page.js
│   │   │   │   │   │
│   │   │   │   │   ├── boolean-search   # 🔍 Boolean search
│   │   │   │   │   │   └── page.js
│   │   │   │   │   │
│   │   │   │   │   ├── closed-jobs/     # 📉 Closed jobs
│   │   │   │   │   │   ├── closed-jobs-table.jsx
│   │   │   │   │   │   └── page.js
│   │   │   │   │   │
│   │   │   │   │   ├── 📂 components    # 🧩 Components for employer dashboard
│   │   │   │   │   │   ├── 📄 ActivirtFeed.js
│   │   │   │   │   │   ├── 📄 AICandidates.js
│   │   │   │   │   │   ├── 📄 AnalyticsCard.js
│   │   │   │   │   │   ├── 📄 JobListing.js
│   │   │   │   │   │   ├── 📄 Sidebar.js
│   │   │   │   │   │   └── 📄 StatsCard.js
│   │   │   │   │   │
│   │   │   │   │   ├── 📂 expired-jobs/ # ⏳ Expired jobs
│   │   │   │   │   │   ├── 📄 expired-jobs-table.jsx
│   │   │   │   │   │   └── 📄 page.js
│   │   │   │   │   │
│   │   │   │   │   ├── 📂 help-center   # ❓ Help center
│   │   │   │   │   │   └── 📄 page.js
│   │   │   │   │   │
│   │   │   │   │   ├── 📂 interview-scheduler # 🗓️ Interview scheduler
│   │   │   │   │   │   └── 📄 page.js
│   │   │   │   │   │
│   │   │   │   │   ├── 📂 post-jobs     # 📝 Post jobs
│   │   │   │   │   │   └── 📄 StatsCard.js
│   │   │   │   │   │
│   │   │   │   │   ├── 📂 subscription  # 💳 Subscription
│   │   │   │   │   │   └── 📄 page.js
│   │   │   │   │   │
│   │   │   │   │   ├── 📄 page.js       # 🖥️ Employer dashboard
│   │   │   │   │   └── 📄 layout.js     # 📢 Layout for job postings
│   │   │   │   │
│   │   │   │   └── 📂 admin/            # 👑 Admin dashboard
│   │   │   │       ├── 📄 page.js       # 🖥️ Admin dashboard page
│   │   │   │       └── 📄 analytics.js  # 📊 Analytics section
│   │   │   │
│   │   │   ├── 📂 applications/         # 📑 Applications module
│   │   │   │   ├── 📄 page.js           # 🖥️ Applications page
│   │   │   │   └── 📄 table.js          # 📊 Applications table
│   │   │   │
│   │   │   ├── 📂 resume-builder/       # 📄 Resume builder
│   │   │   │   ├── 📄 page.js           # 🖥️ Resume builder page
│   │   │   │   ├── 📄 editor.js         # ✏️ Resume editor
│   │   │   │   └── 📄 templates.js      # 🎨 Resume templates
│   │   │   │
│   │   │   ├── 📂 mock-interview/       # 💬 Mock interview
│   │   │   │   ├── 📄 page.js           # 🖥️ Mock interview page
│   │   │   │   ├── 📄 setup.js          # ⚙️ Setup for interviews
│   │   │   │   └── 📄 practice.js       # 🎤 Practice interviews
│   │   │   │
│   │   │   └── 📂 ats-optimizer/        # 🤖 ATS optimizer
│   │   │       ├── 📄 page.js           # 🖥️ ATS optimizer page
│   │   │       ├── 📄 analyzer.js       # 🔍 Resume analyzer
│   │   │       └── 📄 suggestions.js    # 💡 Suggestions for optimization
│   │   │
│   │   ├── 📄 layout.js                 # 🧩 Global layout
│   │   ├── 📄 loading.js                # ⏳ Loading screen
│   │   ├── 📄 not-found.js              # ❌ 404 Not Found page
│   │   └── 📄 page.js                   # 🖥️ Default app page
│   │
│   ├── 📂 components/                   # 🧩 Reusable UI components
│   │   ├── 📂 about/                    # ℹ️ About components
│   │   │   ├── 📄 AboutContent.js       # 📜 About content
│   │   │   ├── 📄 AboutHero.jsx         # 🎯 Hero section
│   │   │   ├── 📄 FAQContent.js         # ❓ FAQ content
│   │   │   ├── 📄 MissionSection.jsx    # 🎯 Mission statement
│   │   │   ├── 📄 TeamSection.jsx       # 👥 Team info
│   │   │   └── 📄 ValueSection.jsx      # 💡 Core values
│   │   │
│   │   ├── 📂 auth/                     # 🔐 Authentication components
│   │   │   ├── 📄 AuthForm.js           # 📝 Auth forms
│   │   │   ├── 📄 OTPVerification.js    # ✅ OTP verification
│   │   │   └── 📄 SocialAuth.js         # 🔗 Social login buttons
│   │   │
│   │   ├── 📂 dashboard/                # 📊 Dashboard components
│   │   │   ├── 📂 cards/                # 🃏 Dashboard cards
│   │   │   │   ├── 📄 QuickAction.js    # ⚡ Quick actions
│   │   │   │   └── 📄 StatsCard.js      # 📈 Stats display
│   │   │   │
│   │   │   └── 📂 sections/             # 📜 Dashboard sections
│   │   │       ├── 📄 RecentActivity.js # 🔄 Recent activity
│   │   │       └── 📄 Upcoming.js       # 📅 Upcoming tasks
│   │   │
│   │   ├── 📂 Footer/                   # 📑 Footer section
│   │   │   └── 📄 Footer.js             # 🦾 Footer component
│   │   │
│   │   ├── 📂 Header/                   # 📑 Header section
│   │   │   └── 📄 Header.js             # 🦾 Header component
│   │   │
│   │   ├── 📂 home/                     # 🏠 Homepage components
│   │   │   ├── 📄 HeroSection.js        # 🎯 Hero section
│   │   │   ├── 📄 JobRow.js             # 📋 Job listings row
│   │   │   ├── 📄 FeaturesSection.js    # ✨ Features section
│   │   │   ├── 📄 TestimonialsSection.js# 🗣️ Testimonials section
│   │   │   ├── 📄 FAQSection.js         # ❓ FAQ section
│   │   │   ├── 📄 NewsletterSection.js  # 📧 Newsletter signup
│   │   │   ├── 📄 PopularSearches.js    # 🔍 Popular searches
│   │   │   ├── 📄 SearchSection.js      # 🔎 Search bar
│   │   │   ├── 📄 Testimonials.js       # 🗣️ Testimonial cards
│   │   │   └── 📄 VideoCard.js          # ▶️ Video cards
│   │   │
│   │   ├── 📂 interview/                # 💬 Interview components
│   │   │   ├── 📄 Feedback.js           # 📝 Interview feedback
│   │   │   ├── 📄 QuestionBank.js       # 📚 Question bank
│   │   │   └── 📄 Recording.js          # 🎤 Interview recording
│   │   │
│   │   ├── 📂 jobs/                     # 📋 Jobs module
│   │   │   ├── 📄 Filters.js            # 🔍 Job filters
│   │   │   ├── 📄 JobCard.js            # 🃏 Single job card
│   │   │   └── 📄 Search.js             # 🔎 Job search
│   │   │
│   │   ├── 📂 resume/                   # 📄 Resume components
│   │   │   ├── 📄 ResumePreview.js      # 🖥️ Resume preview
│   │   │   ├── 📄 SectionEditor.js      # ✏️ Section editor
│   │   │   └── 📄 TemplateSelector.js   # 🎨 Template selector
│   │   │
│   │   ├── 📂 ui/                       # 🎨 UI components
│   │   │   ├── 📂 about/                # ℹ️ About-related UI
│   │   │   │   └── 📄 CTA.jsx           # 🚀 Call-to-action
│   │   │   │
│   │   │   ├── 📂 buttons/              # 🖱️ Buttons
│   │   │   │   ├── 📄 IconButton.js     # 🖼️ Icon button
│   │   │   │   └── 📄 PrimaryButton.js  # ✨ Primary button
│   │   │   │
│   │   │   ├── 📂 feedback/             # 📢 Feedback components
│   │   │   │   ├── 📄 Loader.js         # ⏳ Loading spinner
│   │   │   │   └── 📄 Toast.js          # 🗨️ Toast notifications
│   │   │   │
│   │   │   ├── 📂 forms/                # 📝 Form components
│   │   │   │   ├── 📄 Input.js          # 📋 Input fields
│   │   │   │   └── 📄 Select.js         # 🔽 Dropdown selects
│   │   │   │
│   │   │   ├── 📂 icons/                # 🎨 Icons
│   │   │   │   └── 📂 social/           # 🌐 Social media icons
│   │   │   │       ├── 📄 Facebook.js   # 📘 Facebook icon
│   │   │   │       ├── 📄 Instagram.js  # 📸 Instagram icon
│   │   │   │       ├── 📄 LinkedIn.js   # 💼 LinkedIn icon
│   │   │   │       ├── 📄 Twitter.js    # 🐦 Twitter icon
│   │   │   │       └── 📄 WhatsApp.js   # 💬 WhatsApp icon
│   │   │   │
│   │   │   ├── 📂 jobs/                 # 📝 Job-related UI
│   │   │   │   ├── 📄 JobCard.js        # 🃏 Job card
│   │   │   │   └── 📄 PopularSearches.js# 🔍 Popular searches
│   │   │   │
│   │   │   └── 📂 layout/               # 🧩 Layout components
│   │   │       ├── 📄 Container.js      # 📦 Container wrapper
│   │   │       └── 📄 Section.js        # 📜 Section wrapper
│   │   │
│   │   └── 📄 Layout.js                 # 🧩 Global layout
│   │
│   ├── 📂 contexts/                     # 🌐 Context providers
│   │   ├── 📄 AuthContext.js            # 🔐 Authentication context
│   │   ├── 📄 JobContext.js             # 📝 Job context
│   │   └── 📄 ResumeContext.js          # 📄 Resume context
│   │
│   ├── 📂 hooks/                        # 🪝 Custom hooks
│   │   ├── 📄 useAuth.js                # 🔐 Authentication hook
│   │   ├── 📄 UseJobs.js                # 📋 Jobs hook
│   │   └── 📄 UseResume.js              # 📄 Resume hook
│   │
│   ├── 📂 lib/                          # 🛠️ Utility libraries
│   │   ├── 📂 api/                      # 🌍 API utilities
│   │   │   └── 📄 dashboard.js          # 📊 Dashboard API
│   │   │
│   │   ├── 📄 auth.js                   # 🔐 Authentication utilities
│   │   └── 📄 validation.js             # ✅ Validation utilities
│   │
│   ├── 📂 styles/                       # 🎨 CSS styles
│   │   ├── 📂 components/               # 🧩 Component-specific styles
│   │   │   ├── 📂 about/                # ℹ️ About styles
│   │   │   │   ├── 📄 about.modules.css # 📜 About styles
│   │   │   │   └── 📄 FAQ.modules.css   # ❓ FAQ styles
│   │   │   │
│   │   │   ├── 📂 company/              # 🏢 Company styles
│   │   │   │   ├── 📄 company-card.module.css
│   │   │   │   ├── 📄 company-directory.module.css
│   │   │   │   └── 📄 company-page.module.css
│   │   │   │
│   │   │   ├── 📂 legal/                # ⚖️ Legal styles
│   │   │   │   ├── 📄 policy.module.css
│   │   │   │   ├── 📄 terms.module.css
│   │   │   │   └── 📄 vulnerability-disclosure-policy.module.css
│   │   │   │
│   │   │   ├── 📂 header/               # 📑 Header styles
│   │   │   │   └── 📄 header.module.css
│   │   │   │
│   │   │   └── 📂 footer/               # 📑 Footer styles
│   │   │       └── 📄 footer.module.css
│   │   │
│   │   ├── 📂 employee/                 # 👨‍💼 Employee styles
│   │   │   ├── 📄 EmployeeRegistration.module.css
│   │   │   └── 📄 dashboard.module.css
│   │   │
│   │   ├── 📂 employer/                 # 🏢 Employer styles
│   │   │   ├── 📂 active-jobs/          # 📋 Active jobs styles
│   │   │   │   └── 📄 active-jobs.module.css
│   │   │   │
│   │   │   ├── 📂 ai-candidates/        # 🤖 AI candidates styles
│   │   │   │   └── 📄 ai-candidates-jobs.module.css
│   │   │   │
│   │   │   ├── 📂 ats/                  # 📑 ATS styles
│   │   │   │   └── 📄 ats.module.css
│   │   │   │
│   │   │   ├── 📂 boolean-search/       # 🔍 Boolean search styles
│   │   │   │   └── 📄 boolean-search.module.css
│   │   │   │
│   │   │   ├── 📂 closed-jobs/          # 📉 Closed jobs styles
│   │   │   │   └── 📄 closed-jobs.module.css
│   │   │   │
│   │   │   ├── 📂 expired-jobs/         # ⏳ Expired jobs styles
│   │   │   │   └── 📄 expired-jobs.module.css
│   │   │   │
│   │   │   ├── 📂 help-center/          # ❓ Help center styles
│   │   │   │   └── 📄 help-center.module.css
│   │   │   │
│   │   │   ├── 📂 interview-scheduler/  # 🗓️ Interview scheduler styles
│   │   │   │   └── 📄 interview-scheduler.module.css
│   │   │   │
│   │   │   ├── 📂 login/                # 🔑 Login styles
│   │   │   │   └── 📄 login.module.css
│   │   │   │
│   │   │   ├── 📂 post-jobs/            # 📝 Post jobs styles
│   │   │   │   └── 📄 post-jobs.module.css
│   │   │   │
│   │   │   ├── 📂 registration/         # 📋 Registration styles
│   │   │   │   └── 📄 registration.module.css
│   │   │   │
│   │   │   ├── 📂 subscription/         # 💳 Subscription styles
│   │   │   │   └── 📄 subscription.module.css
│   │   │   │
│   │   │   ├── 📄 ActivityFeed.module.css
│   │   │   ├── 📄 AnalyticsCard.module.css
│   │   │   ├── 📄 animations.module.css
│   │   │   └── 📄 dashboard.module.css
│   │   │
│   │   ├── 📂 home/                     # 🏠 Home styles
│   │   │   └── 📄 home.module.css
│   │   │
│   │   ├── 📄 global.css                # 🌍 Global styles
│   │   ├── 📄 globals.css               # 🌍 Additional global styles
│   │   └── 📄 variables.css             # 🎨 CSS variables
│   │
│   └── 📂 utils/                        # ⚙️ Utility functions
│       ├── 📄 date.js                   # 📅 Date utilities
│       ├── 📄 string.js                 # 🔤 String utilities
│       └── 📄 resumeParser.js           # 📄 Resume parsing utilities
│
├── 📄 .gitignore                           # 🚫 Files to ignore in Git
├── 📄 eslint.config.mjs                    # 🔍 ESLint configuration
├── 📄 jsconfig.json                        # 📦 JavaScript configuration
├── 📄 next.config.js                       # ⚙️ Next.js configuration
├── 📄 package.json                         # 📦 Package dependencies
├── 📄 package-lock.json                    # 🔒 Locked dependencies
├── 📄 postcss.config.js                    # 🎨 PostCSS configuration
├── 📄 postcss.config.mjs                   # 🎨 PostCSS (MJS) configuration
├── 📄 README.md                            # 📜 Project documentation
└── 📄 tailwind.config.js                   # 🎨 Tailwind CSS configuration
```

---

# Hello!

First we will check if our page is ssr or not and will try to run..

**Step 1:** Go to the package.json in your nextjs right click and select open integrated Terminal..

**Step 2:** Enter `npm run dev` command

- Use AI tools like: claude.ai, Gemini, DeepSeek
- ChatGPT is crazy sometimes.

### Make our webpages into SSR.

---

- First copy/ upload the whole html, css, js files into AI "Suggested: DeepSeek, claude.ai"

- **Prompt for making any webpage into ssr:** After uploading the files then

```txt
I want you to make this Koluvu-dashboard webpage into ssr in next js, I will share you my project file structure in that i already have header.js, header.module.css, footer.js, footer.module.css so don't give any separate header and footer codes

You must give me whole code of each file and must give the updated file structure after adding this 'your_page' in present file structure.
remember it should be ssr

koluvu-app/
│
├── 📂 public                             # 🌐 Public assets folder
│   ├── 🖼️ images/                       # 📷 Images directory
│   └── 🎬 videos/                       # ▶️ Videos directory
│
├── 📂 src                                # 🏗️ Source code folder
│   │
│   ├── 📂 app                           # 🚀 Main application routes & pages
│   │   ├── 📂 about/                    # ℹ️ About section
│   │   │   ├── 📂 FAQ/                  # ❓ Frequently Asked Questions
│   │   │   │   └── 📄 page.js           # 📜 FAQ Page
│   │   │   └── 📄 page.js               # 📜 About Page
│   │   │
│   │   ├── 📂 api/                      # 🌍 API endpoints
│   │   │   ├── 📂 auth/                 # 🔐 Authentication APIs
│   │   │   ├── 📂 jobs/                 # 📝 Job-related APIs
│   │   │   └── 📂 ...                   # ➕ More APIs...
│   │   │
│   │   ├── 📂 auth/                     # 🔐 Authentication module
│   │   │   ├── 📂 login/                # 🔑 Login functionality
│   │   │   │   ├── employee/            # 👨‍💼 Employee login
│   │   │   │   │   ├── 📄 page.js       # 🖥️ Employee login page
│   │   │   │   │   └── 📄 form.js       # 📝 Employee login form
│   │   │   │   │
│   │   │   │   └── employer/            # 🏢 Employer login
│   │   │   │       ├── 📄 page.js       # 🖥️ Employer login page
│   │   │   │       └── 📄 form.js       # 📝 Employer login form
│   │   │   │
│   │   │   └── 📂 register/             # 📋 Registration functionality
│   │   │       ├── 📂 employee/         # 👨‍💼 Employee registration
│   │   │       │   ├── 📄 page.js       # 🖥️ Employee registration page
│   │   │       │   └── 📄 VarificationForm.js # ✅ Verification form
│   │   │       │
│   │   │       ├── 📂 employer/         # 🏢 Employer registration
│   │   │       │   ├── 📄 page.js       # 🖥️ Employer registration page
│   │   │       │   └── 📄 form.js       # 📝 Employer registration form
│   │   │       │
│   │   │       └── 📂 partner/          # 🤝 Partner registration
│   │   │           ├── 📄 page.js       # 🖥️ Partner registration page
│   │   │           └── 📄 form.js       # 📝 Partner registration form
│   │   │
│   │   ├── 📂 companies/                # 🏢 Companies module
│   │   │   ├── 📄 page.js               # 📂 Company directory page
│   │   │   │
│   │   │   ├── 📂 components/           # 🧩 Reusable components
│   │   │   │   ├── 📄 CompanyDirectory.js # 📇 Directory view
│   │   │   │   ├── 📄 CompanyCard.js    # 🃏 Single company card
│   │   │   │   ├── 📄 CompanyModal.js   # 💼 Company details modal
│   │   │   │   ├── 📄 CompanyFilters.js # 🔍 Filters for companies
│   │   │   │   └── 📄 CompanySearch.js  # 🔎 Search bar for companies
│   │   │   │
│   │   │   └── 📂 [id]/                 # 🆔 Dynamic company ID route
│   │   │       └── 📄 page.js           # 🏛️ Individual company page
│   │   │
│   │   ├── 📂 legal/                    # ⚖️ Legal documents
│   │   │   ├── 📂 privacy-policy/       # 🔒 Privacy policy
│   │   │   │   └── 📄 page.js           # 📜 Privacy policy page
│   │   │   │
│   │   │   ├── 📂 terms/                # 📑 Terms of service
│   │   │   │   └── 📄 page.js           # 🖥️ Terms page
│   │   │   │
│   │   │   └── 📂 vulnerability-disclosure-policy/ # 🛡️ VDP
│   │   │       └── 📄 page.js           # 🖥️ Vulnerability disclosure policy page
│   │   │
│   │   ├── 📂 main/                     # 🔒 Main application routes
│   │   │   ├── 📂 dashboard/            # 📊 Dashboard module
│   │   │   │   ├── 📂 employee/         # 👨‍💻 Employee dashboard
│   │   │   │   │   ├── 📄 page.js       # 🖥️ Employee dashboard page
│   │   │   │   │   ├── 📄 overview.js   # 👀 Overview section
│   │   │   │   │   └── 📄 stats.js      # 📈 Statistics section
│   │   │   │   │
│   │   │   │   ├── 📂 employer/         # 👔 Employer dashboard
│   │   │   │   │   ├── active-jobs/     # 📋 Active jobs
│   │   │   │   │   │   ├── active-jobs.js
│   │   │   │   │   │   └── page.js
│   │   │   │   │   │
│   │   │   │   │   ├── ai-candidates/   # 🤖 AI candidates
│   │   │   │   │   │   └── page.js
│   │   │   │   │   │
│   │   │   │   │   ├── ats/             # 📑 Applicant tracking system
│   │   │   │   │   │   └── page.js
│   │   │   │   │   │
│   │   │   │   │   ├── boolean-search   # 🔍 Boolean search
│   │   │   │   │   │   └── page.js
│   │   │   │   │   │
│   │   │   │   │   ├── closed-jobs/     # 📉 Closed jobs
│   │   │   │   │   │   ├── closed-jobs-table.jsx
│   │   │   │   │   │   └── page.js
│   │   │   │   │   │
│   │   │   │   │   ├── 📂 components    # 🧩 Components for employer dashboard
│   │   │   │   │   │   ├── 📄 ActivirtFeed.js
│   │   │   │   │   │   ├── 📄 AICandidates.js
│   │   │   │   │   │   ├── 📄 AnalyticsCard.js
│   │   │   │   │   │   ├── 📄 JobListing.js
│   │   │   │   │   │   ├── 📄 Sidebar.js
│   │   │   │   │   │   └── 📄 StatsCard.js
│   │   │   │   │   │
│   │   │   │   │   ├── 📂 expired-jobs/ # ⏳ Expired jobs
│   │   │   │   │   │   ├── 📄 expired-jobs-table.jsx
│   │   │   │   │   │   └── 📄 page.js
│   │   │   │   │   │
│   │   │   │   │   ├── 📂 help-center   # ❓ Help center
│   │   │   │   │   │   └── 📄 page.js
│   │   │   │   │   │
│   │   │   │   │   ├── 📂 interview-scheduler # 🗓️ Interview scheduler
│   │   │   │   │   │   └── 📄 page.js
│   │   │   │   │   │
│   │   │   │   │   ├── 📂 post-jobs     # 📝 Post jobs
│   │   │   │   │   │   └── 📄 StatsCard.js
│   │   │   │   │   │
│   │   │   │   │   ├── 📂 subscription  # 💳 Subscription
│   │   │   │   │   │   └── 📄 page.js
│   │   │   │   │   │
│   │   │   │   │   ├── 📄 page.js       # 🖥️ Employer dashboard
│   │   │   │   │   └── 📄 layout.js     # 📢 Layout for job postings
│   │   │   │   │
│   │   │   │   └── 📂 admin/            # 👑 Admin dashboard
│   │   │   │       ├── 📄 page.js       # 🖥️ Admin dashboard page
│   │   │   │       └── 📄 analytics.js  # 📊 Analytics section
│   │   │   │
│   │   │   ├── 📂 applications/         # 📑 Applications module
│   │   │   │   ├── 📄 page.js           # 🖥️ Applications page
│   │   │   │   └── 📄 table.js          # 📊 Applications table
│   │   │   │
│   │   │   ├── 📂 resume-builder/       # 📄 Resume builder
│   │   │   │   ├── 📄 page.js           # 🖥️ Resume builder page
│   │   │   │   ├── 📄 editor.js         # ✏️ Resume editor
│   │   │   │   └── 📄 templates.js      # 🎨 Resume templates
│   │   │   │
│   │   │   ├── 📂 mock-interview/       # 💬 Mock interview
│   │   │   │   ├── 📄 page.js           # 🖥️ Mock interview page
│   │   │   │   ├── 📄 setup.js          # ⚙️ Setup for interviews
│   │   │   │   └── 📄 practice.js       # 🎤 Practice interviews
│   │   │   │
│   │   │   └── 📂 ats-optimizer/        # 🤖 ATS optimizer
│   │   │       ├── 📄 page.js           # 🖥️ ATS optimizer page
│   │   │       ├── 📄 analyzer.js       # 🔍 Resume analyzer
│   │   │       └── 📄 suggestions.js    # 💡 Suggestions for optimization
│   │   │
│   │   ├── 📄 layout.js                 # 🧩 Global layout
│   │   ├── 📄 loading.js                # ⏳ Loading screen
│   │   ├── 📄 not-found.js              # ❌ 404 Not Found page
│   │   └── 📄 page.js                   # 🖥️ Default app page
│   │
│   ├── 📂 components/                   # 🧩 Reusable UI components
│   │   ├── 📂 about/                    # ℹ️ About components
│   │   │   ├── 📄 AboutContent.js       # 📜 About content
│   │   │   ├── 📄 AboutHero.jsx         # 🎯 Hero section
│   │   │   ├── 📄 FAQContent.js         # ❓ FAQ content
│   │   │   ├── 📄 MissionSection.jsx    # 🎯 Mission statement
│   │   │   ├── 📄 TeamSection.jsx       # 👥 Team info
│   │   │   └── 📄 ValueSection.jsx      # 💡 Core values
│   │   │
│   │   ├── 📂 auth/                     # 🔐 Authentication components
│   │   │   ├── 📄 AuthForm.js           # 📝 Auth forms
│   │   │   ├── 📄 OTPVerification.js    # ✅ OTP verification
│   │   │   └── 📄 SocialAuth.js         # 🔗 Social login buttons
│   │   │
│   │   ├── 📂 dashboard/                # 📊 Dashboard components
│   │   │   ├── 📂 cards/                # 🃏 Dashboard cards
│   │   │   │   ├── 📄 QuickAction.js    # ⚡ Quick actions
│   │   │   │   └── 📄 StatsCard.js      # 📈 Stats display
│   │   │   │
│   │   │   └── 📂 sections/             # 📜 Dashboard sections
│   │   │       ├── 📄 RecentActivity.js # 🔄 Recent activity
│   │   │       └── 📄 Upcoming.js       # 📅 Upcoming tasks
│   │   │
│   │   ├── 📂 Footer/                   # 📑 Footer section
│   │   │   └── 📄 Footer.js             # 🦾 Footer component
│   │   │
│   │   ├── 📂 Header/                   # 📑 Header section
│   │   │   └── 📄 Header.js             # 🦾 Header component
│   │   │
│   │   ├── 📂 home/                     # 🏠 Homepage components
│   │   │   ├── 📄 HeroSection.js        # 🎯 Hero section
│   │   │   ├── 📄 JobRow.js             # 📋 Job listings row
│   │   │   ├── 📄 FeaturesSection.js    # ✨ Features section
│   │   │   ├── 📄 TestimonialsSection.js# 🗣️ Testimonials section
│   │   │   ├── 📄 FAQSection.js         # ❓ FAQ section
│   │   │   ├── 📄 NewsletterSection.js  # 📧 Newsletter signup
│   │   │   ├── 📄 PopularSearches.js    # 🔍 Popular searches
│   │   │   ├── 📄 SearchSection.js      # 🔎 Search bar
│   │   │   ├── 📄 Testimonials.js       # 🗣️ Testimonial cards
│   │   │   └── 📄 VideoCard.js          # ▶️ Video cards
│   │   │
│   │   ├── 📂 interview/                # 💬 Interview components
│   │   │   ├── 📄 Feedback.js           # 📝 Interview feedback
│   │   │   ├── 📄 QuestionBank.js       # 📚 Question bank
│   │   │   └── 📄 Recording.js          # 🎤 Interview recording
│   │   │
│   │   ├── 📂 jobs/                     # 📋 Jobs module
│   │   │   ├── 📄 Filters.js            # 🔍 Job filters
│   │   │   ├── 📄 JobCard.js            # 🃏 Single job card
│   │   │   └── 📄 Search.js             # 🔎 Job search
│   │   │
│   │   ├── 📂 resume/                   # 📄 Resume components
│   │   │   ├── 📄 ResumePreview.js      # 🖥️ Resume preview
│   │   │   ├── 📄 SectionEditor.js      # ✏️ Section editor
│   │   │   └── 📄 TemplateSelector.js   # 🎨 Template selector
│   │   │
│   │   ├── 📂 ui/                       # 🎨 UI components
│   │   │   ├── 📂 about/                # ℹ️ About-related UI
│   │   │   │   └── 📄 CTA.jsx           # 🚀 Call-to-action
│   │   │   │
│   │   │   ├── 📂 buttons/              # 🖱️ Buttons
│   │   │   │   ├── 📄 IconButton.js     # 🖼️ Icon button
│   │   │   │   └── 📄 PrimaryButton.js  # ✨ Primary button
│   │   │   │
│   │   │   ├── 📂 feedback/             # 📢 Feedback components
│   │   │   │   ├── 📄 Loader.js         # ⏳ Loading spinner
│   │   │   │   └── 📄 Toast.js          # 🗨️ Toast notifications
│   │   │   │
│   │   │   ├── 📂 forms/                # 📝 Form components
│   │   │   │   ├── 📄 Input.js          # 📋 Input fields
│   │   │   │   └── 📄 Select.js         # 🔽 Dropdown selects
│   │   │   │
│   │   │   ├── 📂 icons/                # 🎨 Icons
│   │   │   │   └── 📂 social/           # 🌐 Social media icons
│   │   │   │       ├── 📄 Facebook.js   # 📘 Facebook icon
│   │   │   │       ├── 📄 Instagram.js  # 📸 Instagram icon
│   │   │   │       ├── 📄 LinkedIn.js   # 💼 LinkedIn icon
│   │   │   │       ├── 📄 Twitter.js    # 🐦 Twitter icon
│   │   │   │       └── 📄 WhatsApp.js   # 💬 WhatsApp icon
│   │   │   │
│   │   │   ├── 📂 jobs/                 # 📝 Job-related UI
│   │   │   │   ├── 📄 JobCard.js        # 🃏 Job card
│   │   │   │   └── 📄 PopularSearches.js# 🔍 Popular searches
│   │   │   │
│   │   │   └── 📂 layout/               # 🧩 Layout components
│   │   │       ├── 📄 Container.js      # 📦 Container wrapper
│   │   │       └── 📄 Section.js        # 📜 Section wrapper
│   │   │
│   │   └── 📄 Layout.js                 # 🧩 Global layout
│   │
│   ├── 📂 contexts/                     # 🌐 Context providers
│   │   ├── 📄 AuthContext.js            # 🔐 Authentication context
│   │   ├── 📄 JobContext.js             # 📝 Job context
│   │   └── 📄 ResumeContext.js          # 📄 Resume context
│   │
│   ├── 📂 hooks/                        # 🪝 Custom hooks
│   │   ├── 📄 useAuth.js                # 🔐 Authentication hook
│   │   ├── 📄 UseJobs.js                # 📋 Jobs hook
│   │   └── 📄 UseResume.js              # 📄 Resume hook
│   │
│   ├── 📂 lib/                          # 🛠️ Utility libraries
│   │   ├── 📂 api/                      # 🌍 API utilities
│   │   │   └── 📄 dashboard.js          # 📊 Dashboard API
│   │   │
│   │   ├── 📄 auth.js                   # 🔐 Authentication utilities
│   │   └── 📄 validation.js             # ✅ Validation utilities
│   │
│   ├── 📂 styles/                       # 🎨 CSS styles
│   │   ├── 📂 components/               # 🧩 Component-specific styles
│   │   │   ├── 📂 about/                # ℹ️ About styles
│   │   │   │   ├── 📄 about.modules.css # 📜 About styles
│   │   │   │   └── 📄 FAQ.modules.css   # ❓ FAQ styles
│   │   │   │
│   │   │   ├── 📂 company/              # 🏢 Company styles
│   │   │   │   ├── 📄 company-card.module.css
│   │   │   │   ├── 📄 company-directory.module.css
│   │   │   │   └── 📄 company-page.module.css
│   │   │   │
│   │   │   ├── 📂 legal/                # ⚖️ Legal styles
│   │   │   │   ├── 📄 policy.module.css
│   │   │   │   ├── 📄 terms.module.css
│   │   │   │   └── 📄 vulnerability-disclosure-policy.module.css
│   │   │   │
│   │   │   ├── 📂 header/               # 📑 Header styles
│   │   │   │   └── 📄 header.module.css
│   │   │   │
│   │   │   └── 📂 footer/               # 📑 Footer styles
│   │   │       └── 📄 footer.module.css
│   │   │
│   │   ├── 📂 employee/                 # 👨‍💼 Employee styles
│   │   │   ├── 📄 EmployeeRegistration.module.css
│   │   │   └── 📄 dashboard.module.css
│   │   │
│   │   ├── 📂 employer/                 # 🏢 Employer styles
│   │   │   ├── 📂 active-jobs/          # 📋 Active jobs styles
│   │   │   │   └── 📄 active-jobs.module.css
│   │   │   │
│   │   │   ├── 📂 ai-candidates/        # 🤖 AI candidates styles
│   │   │   │   └── 📄 ai-candidates-jobs.module.css
│   │   │   │
│   │   │   ├── 📂 ats/                  # 📑 ATS styles
│   │   │   │   └── 📄 ats.module.css
│   │   │   │
│   │   │   ├── 📂 boolean-search/       # 🔍 Boolean search styles
│   │   │   │   └── 📄 boolean-search.module.css
│   │   │   │
│   │   │   ├── 📂 closed-jobs/          # 📉 Closed jobs styles
│   │   │   │   └── 📄 closed-jobs.module.css
│   │   │   │
│   │   │   ├── 📂 expired-jobs/         # ⏳ Expired jobs styles
│   │   │   │   └── 📄 expired-jobs.module.css
│   │   │   │
│   │   │   ├── 📂 help-center/          # ❓ Help center styles
│   │   │   │   └── 📄 help-center.module.css
│   │   │   │
│   │   │   ├── 📂 interview-scheduler/  # 🗓️ Interview scheduler styles
│   │   │   │   └── 📄 interview-scheduler.module.css
│   │   │   │
│   │   │   ├── 📂 login/                # 🔑 Login styles
│   │   │   │   └── 📄 login.module.css
│   │   │   │
│   │   │   ├── 📂 post-jobs/            # 📝 Post jobs styles
│   │   │   │   └── 📄 post-jobs.module.css
│   │   │   │
│   │   │   ├── 📂 registration/         # 📋 Registration styles
│   │   │   │   └── 📄 registration.module.css
│   │   │   │
│   │   │   ├── 📂 subscription/         # 💳 Subscription styles
│   │   │   │   └── 📄 subscription.module.css
│   │   │   │
│   │   │   ├── 📄 ActivityFeed.module.css
│   │   │   ├── 📄 AnalyticsCard.module.css
│   │   │   ├── 📄 animations.module.css
│   │   │   └── 📄 dashboard.module.css
│   │   │
│   │   ├── 📂 home/                     # 🏠 Home styles
│   │   │   └── 📄 home.module.css
│   │   │
│   │   ├── 📄 global.css                # 🌍 Global styles
│   │   ├── 📄 globals.css               # 🌍 Additional global styles
│   │   └── 📄 variables.css             # 🎨 CSS variables
│   │
│   └── 📂 utils/                        # ⚙️ Utility functions
│       ├── 📄 date.js                   # 📅 Date utilities
│       ├── 📄 string.js                 # 🔤 String utilities
│       └── 📄 resumeParser.js           # 📄 Resume parsing utilities
│
├── 📄 .gitignore                           # 🚫 Files to ignore in Git
├── 📄 eslint.config.mjs                    # 🔍 ESLint configuration
├── 📄 jsconfig.json                        # 📦 JavaScript configuration
├── 📄 next.config.js                       # ⚙️ Next.js configuration
├── 📄 package.json                         # 📦 Package dependencies
├── 📄 package-lock.json                    # 🔒 Locked dependencies
├── 📄 postcss.config.js                    # 🎨 PostCSS configuration
├── 📄 postcss.config.mjs                   # 🎨 PostCSS (MJS) configuration
├── 📄 README.md                            # 📜 Project documentation
└── 📄 tailwind.config.js                   # 🎨 Tailwind CSS configuration
```

- DeepSeek's server is very busy at morning but after 11:30 PM, it is vert free... till 1:30 AM

- If you don't know where the file content should be.. just copy the the above file structure and give it to DeepSeek and ask him where to paste the code.

- Everytime ask for whole code so that our work will be reduced.

- If you are familiar with React/ Next you can just add that header.js, footer.js part in the existing Header.js, footer.js.

- I am not much familier wih it so i will use claude because DeepSeek server is busy now.

- If you see in 1st line of code we can see if our page is ssr or csr. If you find import 'client' then it is 100% CSR.

- Before running the pages install this react library

  ```md
  npm install @fortawesome/fontawesome-svg-core @fortawesome/free-solid-svg-icons
  ```

- http://localhost:3000/auth/register/employee will be showing you Employee Registration page
- http://localhost:3000/main/dashboard/employee will be showing you Koluvu Dashbord

---

**11th April**

- Added Index page (Landing page) and Policy-Page (Legal), also connected policy page with footer now clicking privacy policy will take you to privacy policy page. And also updated the file structure

- work to be done (Adding CSS for Index page (Landing Page), and Privacy-policy pages)

---

# Tailwind CSS Installation & Error Resolution Guide

## 🛠 Initial Setup Commands

### 1. Install Tailwind and dependencies:

```bash
npm install -D tailwindcss postcss autoprefixer
```

### 2. Initialize Tailwind:

```bash
npx tailwindcss init -p
```

### 3. Install recommended plugins:

```bash
npm install -D @tailwindcss/forms @tailwindcss/typography
```

---

## ⚠️ Error Resolution Commands

### 🔄 For Hydration Mismatch Errors

> Update `layout.js` with `suppressHydrationWarning`

- No terminal commands needed — just code changes.

---

### 🔤 For Missing `font-heading` Class

> Update `tailwind.config.js` with `fontFamily` config.

Install fonts if needed:

```bash
npm install @fontsource/inter @fontsource/poppins
```

---

### 📐 For Missing `@tailwindcss/aspect-ratio`

**Option 1: Install it**

```bash
npm install -D @tailwindcss/aspect-ratio
```

**Option 2: Remove it** from `tailwind.config.js` plugins.

---

### 🧹 For Cache/Cleanup Issues

```bash
rm -rf node_modules .next package-lock.json
npm cache clean --force
npm install
```

---

### 🔍 For Dependency Verification

Check installed versions:

```bash
npm list tailwindcss postcss autoprefixer
```

Verify plugins:

```bash
npm list @tailwindcss/forms @tailwindcss/typography
```

---

## ⚙️ Key Configuration Files

### `tailwind.config.js`

```javascript
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        koluvu: {
          primary: "#003366",
          secondary: "#006699",
          accent: "#FF6B35",
        },
      },
      fontFamily: {
        heading: ["Poppins", "sans-serif"],
      },
    },
  },
  plugins: [require("@tailwindcss/forms"), require("@tailwindcss/typography")],
};
```

---

### `globals.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

---

### `postcss.config.js`

```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

---

## 🚀 Development Commands

Start dev server:

```bash
npm run dev
```

Production build:

```bash
npm run build
```

Start production server:

```bash
npm run start
```

> 💡 **Remember:** Restart your development server after making configuration changes!

---

Save this file as `TAILWIND_SETUP.md` in your project for future reference.

---

### Legal page icons

```bash
npm install @heroicons/react  # For the icons
npm install framer-motion @heroicons/react  # For the icons
```

---

# 🚀 Supabase Auth Setup for Next.js + Django + PostgreSQL

This guide walks you through integrating **Supabase Authentication** into a **Next.js frontend**, with a **Django backend** and a **PostgreSQL** database (can be self-hosted or managed).

---

## 🧾 Table of Contents

1. [Sign Up & Create Project on Supabase](#1-sign-up--create-project-on-supabase)
2. [Configure Supabase Project](#2-configure-supabase-project)
3. [Set Up Authentication](#3-set-up-authentication)
4. [Integrate Supabase in Next.js](#4-integrate-supabase-in-nextjs)
5. [Connect Supabase Auth to Django Backend](#5-connect-supabase-auth-to-django-backend)
6. [Verify JWT in Django](#6-verify-jwt-in-django)
7. [Extras & Security](#7-extras--security)

---

## 1. ✍️ Sign Up & Create Project on Supabase

1. Go to [https://supabase.com/](https://supabase.com/)
2. Click on **Start your project** and sign in via GitHub or Email.
3. Click **New Project**.
4. Fill in the project details:
   - **Name**: e.g., `my-app`
   - **Database Password**: Secure password (you'll need this later)
   - **Region**: Closest to your users
5. Click **Create new project**. Wait a few seconds for the setup.

---

## 2. ⚙️ Configure Supabase Project

1. Once inside your Supabase project:
   - Go to **Settings > API**
   - Note down:
     - `Project URL`
     - `anon` public key (for client)
     - `service_role` key (for secure backend)

---

## 3. 🔐 Set Up Authentication

1. Navigate to **Authentication > Settings** in the Supabase dashboard.
2. Under **Auth Providers**, enable the ones you want (Email, Google, GitHub, etc.)
3. Configure Redirect URLs:
   - e.g., `http://localhost:3000/` for dev
   - Add production domains when ready
4. Under **Policies**, ensure you allow `authenticated` users to access user data.

---

## 4. 🧹 Integrate Supabase in Next.js

### 4.1 Install Supabase Client

```bash
npm install @supabase/supabase-js
```

### 4.2 Create a Supabase Client

```ts
// lib/supabaseClient.ts
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

### 4.3 Auth Example (Sign In)

```ts
// pages/login.tsx
import { supabase } from "../lib/supabaseClient";

const loginWithEmail = async () => {
  const { error } = await supabase.auth.signInWithOtp({
    email: "user@example.com",
  });
  if (error) console.error(error);
};
```

---

## 5. 💠 Connect Supabase Auth to Django Backend

1. Supabase Auth returns a JWT after login.
2. Send this JWT in the `Authorization` header from your frontend to the Django backend:

```ts
const {
  data: { session },
} = await supabase.auth.getSession();
const token = session?.access_token;

await fetch("http://localhost:8000/api/protected/", {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
```

---

## 6. 🔐 Verify JWT in Django

### 6.1 Install Required Packages

```bash
pip install djangorestframework python-jose
```

### 6.2 Middleware or Auth Class to Verify JWT

```python
# auth/jwt_auth.py
from jose import jwt
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
import requests

SUPABASE_JWT_SECRET = '<your-jwt-secret>'  # Get from Supabase API settings

class SupabaseJWTAuthentication(BaseAuthentication):
    def authenticate(self, request):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return None

        token = auth_header.split(' ')[1]

        try:
            payload = jwt.decode(token, SUPABASE_JWT_SECRET, algorithms=['HS256'])
        except jwt.JWTError:
            raise AuthenticationFailed('Invalid Supabase JWT')

        # Optionally validate user, create user model, etc.
        return (payload, None)
```

### 6.3 Use It in DRF Settings

```python
# settings.py
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'auth.jwt_auth.SupabaseJWTAuthentication',
    ]
}
```

---

## 7. 🔒 Extras & Security

- 🔀 Refresh JWT tokens periodically in frontend
- 🧶 Use Supabase Row Level Security (RLS) for fine-grained control
- 🔐 Store secrets (like `SUPABASE_JWT_SECRET`) in `.env` files
- 🛋️ Use `dotenv` in Django for secret management

---

## ✅ Done!

You now have Supabase Authentication working with:

- ✨ **Next.js frontend**
- 🐍 **Django backend**
- 🐘 **PostgreSQL database**

Let me know if you need a boilerplate repo to get started faster!

for page.js in post-jobs we need to install this package:

```bash
npm install flatpickr
```
