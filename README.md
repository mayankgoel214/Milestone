# Milestone (formerly ABLE)

A React Native app for parents of children with special needs in India:
understand your child's needs through a guided assessment, find therapists,
book sessions, and get AI-assisted parenting support — in one place.

Built at a hackathon as **ABLE**; the repo is renamed Milestone, and the
in-app branding still says ABLE (the logo and app identity were designed
under that name).

**Demo video:** [docs/milestone-demo.mp4](docs/milestone-demo.mp4) ·
**APK:** see [Releases](https://github.com/mayankgoel214/Milestone/releases)

## What it is

- **32 screens** (Expo Router route groups, strict TypeScript): welcome →
  language selection → login → a 5-step onboarding assessment → generated
  results (assessment, strengths, action plan) → a parent home with
  community and resources tabs → therapist discovery, profiles and a
  booking flow → session tracking, document upload, progress — plus a
  separate **provider side** with a dashboard and per-student views.
- **AI parent-support chat** on GPT-4o-mini with a domain-specific system
  prompt: scoped to special-needs parenting in India, refuses diagnoses,
  knows IEP/educational-rights context, offers quick-start questions.

## What is honest to know (prototype status)

This is a product prototype, and the app says so where it matters:

- **Auth is UI-only.** Parent phone-OTP and provider email/password screens
  exist but neither authenticates; the supported way in is the labelled
  **"Explore the demo"** button on the login screen. Firebase phone auth and
  a Supabase email-OTP module are wired in `services/` but unreachable from
  the shipped UI.
- **Therapist data is mock data** shipped in the app. There is no backend.
- **The language screen offers English, Hindi, Tamil and Telugu, but the UI
  is English-only** — no i18n layer consumes the choice yet.
- **The AI chat needs a key.** Set `EXPO_PUBLIC_OPENAI_API_KEY` in `.env`;
  without one the chat says plainly that the assistant is not live in this
  build. (An `EXPO_PUBLIC_` key is embedded in the client — fine for a
  prototype build you keep to yourself, not a way to ship a paid key.)
- The onboarding "generating your plan" step is presentational; results are
  from the assessment answers, not a model call.

## Run it

```bash
cd able-app
npm install
npx expo start          # then press a for Android, i for iOS
```

Build the Android APK locally (needs the Android SDK + JDK 17+):

```bash
cd able-app
npx expo prebuild --platform android
cd android && ./gradlew assembleRelease
# app/build/outputs/apk/release/app-release.apk
```

## Stack

React Native 0.81 · Expo SDK 54 · Expo Router 6 · TypeScript (strict) ·
Zustand · react-hook-form + zod · Moti/Reanimated · OpenAI (chat)
