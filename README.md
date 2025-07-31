#  Secure Information Asset Classification Platform

This platform was developed during a 2-month internship at **IT6 Consulting S.A.R.L.**, a Rabat-based IT governance and cybersecurity firm.

The goal was to digitize and secure the organization's information classification workflow in compliance with both international and national regulations, including:

- **ISO 27001** – Information Security Management Systems
- **ISO 27005** – Risk Management in Information Security
- **DNSSI** – Directives Nationales de Sécurité des Systèmes d’Information (Morocco)
- **Law 05-20** – Cybercrime Law
- **Law 09-08** – Personal Data Protection Law

Built with **Next.js** and **Tailwind CSS**, the system supports granular classification using the DICT model, evaluates risk via probabilistic and impact-based analysis, and offers real-time dashboards, traceable audits, and document version control.

---

##  Key Features

### Information Asset Classification
- Based on **DICT** dimensions:
  - **D**isponibilité (Availability)
  - **I**ntégrité (Integrity)
  - **C**onfidentialité (Confidentiality)
  - **T**raçabilité (Traceability)
- Uses **DNSSI levels**: _Très Confidentiel_, _Confidentiel_, _Interne_, _Non classifié_
- Auto-suggestion of DICT scores depending on classification level
- Smart `clampScore()` logic: user-entered scores > 5 are automatically capped at 5

### Risk Assessment Engine
- Assesses 4 impact areas: _Opérationnel_, _Conformité_, _Réputationnel_, _Financier_
- Supports:
  - Probabilité (likelihood)
  - Exposition (exposure)
  - Risque Brut (inherent risk)
  - Atténuation (%) (mitigation percentage)
  - Risque Résiduel (residual risk)
  - Risque Accepté (accepted risk)
- Real-time calculated *Niveau de Risque* and *Analyse de Risque*

###  Assets Management + Filtering
- Live filtering by:
  -  Name / Department / ID
  -  Risk level (Élevé, Moyen, Faible)
  - Compliance (Conforme / Non Conforme)
  - Date of creation
- Inline editing and secure deletion with password confirmation
- File upload support for .pdf, .doc(x), .jpg/.png attachments
- Auto-calculation of risk fields upon form edit

### Interactive Dashboard
- Visual summaries via Recharts:
  - Risk level distribution
  - Departmental classification
  - Residual risk levels
  - Sensitivity tiers
  - Accepted vs. unaccepted risk
  - Avg. residual risk per *processus*
- Departmental pie charts with direct navigation to `/processus`

### Audit Trail
- Every modification or deletion is logged:
  - Timestamp, action type, document ID, and name
- Exportable as `.csv` via built-in button
- LocalStorage-based audit history with live updates across tabs

---

## Tech Stack

| Layer | Technologies |
|-------|--------------|
| Frontend | React (Next.js), Tailwind CSS |
| Charts | Recharts |
| State | React Hooks, LocalStorage |
| Backend | Next.js API routes |
| Database | JSON-based in development (can be replaced with MongoDB/Prisma) |
| Auth | Simple password prompt for protected actions |

---

##  Glossary – French to English

###  DICT Model
| French              | English          | Definition |
|---------------------|------------------|------------|
| Disponibilité        | Availability      | Timely access to information |
| Intégrité            | Integrity         | Information accuracy and trustworthiness |
| Confidentialité      | Confidentiality   | Protection from unauthorized access |
| Traçabilité          | Traceability      | Ability to track and audit information changes |

###  Risk Terms
| French               | English              | Description |
|----------------------|----------------------|-------------|
| Impact Opérationnel   | Operational Impact    | Effect on business continuity and productivity |
| Impact Conformité     | Compliance Impact     | Legal or regulatory repercussions |
| Impact Réputationnel  | Reputational Impact   | Trust and image degradation |
| Impact Financier      | Financial Impact      | Monetary loss or unplanned cost |
| Probabilité           | Probability           | Likelihood of threat occurring |
| Exposition            | Exposure              | Asset vulnerability level |
| Risque Brut           | Inherent Risk         | Risk without any mitigation applied |
| Atténuation           | Mitigation            | Percentage reduction in risk |
| Risque Résiduel       | Residual Risk         | Remaining risk after applying mitigations |
| Risque Accepté        | Accepted Risk         | Risk the organization agrees to tolerate |
| Sensibilité           | Sensitivity           | Composite score from DICT |

---

##  Contact

Built by : [Fatima Zahra Zhiri](https://www.linkedin.com/in/fatima-zahra-zhiri-722046274/)  
## Running the Project Locally

```bash
# 1. Clone the repo
git clone https://github.com/yourusername/secure-info-classification.git

# 2. Navigate into it
cd secure-info-classification

# 3. Install dependencies
npm install

# 4. Start the server
npm run dev
---

