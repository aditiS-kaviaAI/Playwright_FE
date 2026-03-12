# Page snapshot

```yaml
- generic [ref=e4]:
  - generic [ref=e5]:
    - img "Company logo" [ref=e6]
    - heading "Sign in" [level=2] [ref=e7]
    - generic [ref=e8]: Access your dashboard
  - generic [ref=e9]:
    - generic [ref=e10]:
      - generic [ref=e11]: Email
      - textbox "Email address" [ref=e12]:
        - /placeholder: you@example.com
    - button "Find organizations for this email" [disabled] [ref=e14]: Find Organizations
    - generic [ref=e15]:
      - generic [ref=e16]: Organization
      - combobox "Organization" [ref=e17]:
        - option "Select organization..." [selected]
    - generic [ref=e18]:
      - generic [ref=e19]: Password
      - textbox "Password" [ref=e20]:
        - /placeholder: ••••••••
    - button "Login" [disabled] [ref=e21]
  - generic [ref=e23]: By signing in you agree to the Terms and Privacy Policy.
```