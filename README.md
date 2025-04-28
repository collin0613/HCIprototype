# Email Enhancer (Local OLM)

Our HCI prototype utilizes Google Chrome Extension capabilities and front-end programming. This extension will be applied to a student email interface and incorporate features that aim to improve how efficiently college students find important emails in a spammed inbox.

## File Structure

```
HCIprototype/
├── manifest.json           # Extension manifest (MV3)
├── lib/
│   └── jszip.min.js        # JSZip library for parsing OLM
├── content/
│   ├── script.js           # Content script with UI & parsing logic
│   └── styles.css          # Styles for injected UI
├── icons/
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── README.md               # This documentation file
```

## Study Design

### Participant Pool
- Focus exclusively on students at Stevens Institute of Technology.  
- Recruit 15–20 participants via targeted emails and personal invitations.  
- Ensure a diverse, representative sample across majors and years.

### Experimental Design
- **Within-subjects design:** Each participant uses both the current email platform and our redesigned prototype.  
- Controls for individual differences and allows direct comparison.

### Procedure
1. Participants perform identical email-related tasks in a controlled setting, first on the unmodified platform and then with the Chrome extension (or vice versa).  
2. Counterbalance condition order to minimize order effects.  
3. Each participant completes two blocks of three trials per system, identifying and opening emails in specified categories enabled by the extension.

### Measurable Variables
- **Task completion time (quantitative):** Seconds to open specific emails, comparing efficiency.  
- **Perceived usability (qualitative & quantitative):** System Usability Scale administered after each condition.  
- **User satisfaction & preference (qualitative):** Open-ended interviews and Likert-scale surveys on comfort, frustration, and overall impressions.

These measures combine objective performance metrics with subjective user feedback to evaluate both the effectiveness and user experience of our design.

