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
│   ├── HCIPrototype.png
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

## Email Export Instructions

To analyze your full inbox locally, first export your emails from Outlook into an archive file:

### Outlook for Mac (Legacy client)
1. Open the **Outlook for Mac** application (disable “New Outlook” if needed by toggling the switch in the top-right corner).  
2. In the macOS menu bar, click **File → Export…**.  
3. In the dialog, choose **“Outlook for Mac Data File (.olm)”**.  
4. Check only **Mail** (and if available, select **Inbox**).  
5. Click **Continue**, choose a save location (e.g. `inbox_export.olm`), and wait for completion.

### Outlook for Windows (Desktop client)
1. Open **Outlook for Windows**.  
2. Go to **File → Open & Export → Import/Export**.  
3. Select **“Export to a file”**, click **Next**.  
4. Choose **“Outlook Data File (.pst)”**, click **Next**.  
5. Select your **Inbox** folder (and subfolders if desired), click **Next**.  
6. Browse to save as e.g. `inbox_export.pst`, finish the export.

> **Alternative CSV export (Windows only):**  
> - In the Import/Export wizard choose **“Comma Separated Values”** instead of PST.  
> - Select **Inbox**, save as `inbox_export.csv`.  
> - This yields a CSV of Subject, From, Date, etc., which can also be parsed by the extension.

Once you have your `.olm`, `.pst`, or `.csv` file, click **📂 Load OLM…** in the extension UI to parse and begin filtering your messages.
