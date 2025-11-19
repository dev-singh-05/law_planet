import { NextRequest, NextResponse } from 'next/server';

// Mock AI responses for legal queries
const mockAIResponses = [
  {
    keywords: ['fir', 'complaint', 'police', 'crime'],
    response: `To file an FIR (First Information Report) in India:

1. **Visit the Police Station**: You can visit any police station in the jurisdiction where the crime occurred.

2. **Provide Details**: Clearly state the details of the offense - what happened, when, where, and who was involved.

3. **Written Report**: The police must register your FIR in writing. You have the right to get a copy.

4. **Zero FIR**: If you're in a different jurisdiction, you can file a Zero FIR, which will be transferred to the appropriate police station.

5. **Online FIR**: Many states now allow online FIR filing for certain offenses through state police websites.

6. **Important Rights**:
   - Police cannot refuse to file an FIR for a cognizable offense
   - You're entitled to a free copy of the FIR
   - If police refuse, you can approach the Superintendent of Police or Judicial Magistrate

**Legal Basis**: Section 154 of the Criminal Procedure Code (CrPC) governs FIR filing.

Would you like more specific information about your situation?`,
  },
  {
    keywords: ['consumer', 'complaint', 'defective', 'product', 'service'],
    response: `To file a consumer complaint in India under the Consumer Protection Act, 2019:

1. **Determine Jurisdiction**:
   - District Forum: Claims up to ₹1 crore
   - State Commission: Claims ₹1 crore to ₹10 crores
   - National Commission: Claims above ₹10 crores

2. **Required Documents**:
   - Purchase invoice/receipt
   - Warranty/guarantee card
   - Correspondence with seller/manufacturer
   - Evidence of defect or deficiency

3. **Filing Process**:
   - Can be filed online through edaakhil.nic.in
   - Or in person at the appropriate consumer forum
   - Complaint format should include: complainant details, opposite party details, facts, relief sought

4. **No Court Fee**: Consumer complaints don't require court fees.

5. **Time Limit**: Must be filed within 2 years from the date of cause of action.

6. **Legal Representation**: You can appear yourself or through an authorized representative.

The Consumer Protection Act, 2019 provides strong remedies including refund, replacement, compensation, and punitive damages.

Would you like help drafting a complaint?`,
  },
  {
    keywords: ['property', 'sale', 'purchase', 'agreement', 'registration'],
    response: `Important steps for property transactions in India:

1. **Verification**:
   - Check property title and ownership documents
   - Verify encumbrance certificate (EC) for past 30 years
   - Ensure no pending litigation
   - Check municipal approvals and occupancy certificate

2. **Agreement to Sell**:
   - Draft agreement with all terms clearly mentioned
   - Pay token amount (typically 10-20%)
   - Agreement should be stamped

3. **Due Diligence**:
   - Verify seller's identity and ownership rights
   - Check for any mortgages or liens
   - Confirm property tax payments are up to date

4. **Sale Deed Registration**:
   - Must be registered at the Sub-Registrar's office
   - Required documents: ID proofs, property documents, NOC from society
   - Pay stamp duty and registration fees (varies by state)
   - Both parties must be present

5. **Post-Registration**:
   - Update property tax records
   - Transfer utility connections
   - Update address in documents

**Key Laws**: Transfer of Property Act, 1882 and Registration Act, 1908

Important: Always consult a lawyer and conduct thorough due diligence before property transactions.

Would you like specific guidance on your property matter?`,
  },
  {
    keywords: ['divorce', 'marriage', 'family', 'custody', 'maintenance'],
    response: `Family law matters in India - Key Information:

**Divorce in India:**

1. **Mutual Consent Divorce**: Both spouses agree
   - Minimum 6 months separation required
   - Cooling-off period of 6 months (can be waived)
   - Governed by respective personal laws

2. **Contested Divorce**: One-sided petition
   - Grounds: Cruelty, adultery, desertion (2 years), conversion, mental disorder, venereal disease, renunciation
   - Length process (typically 2-5 years)

3. **Child Custody**:
   - Best interest of child is paramount
   - Mother typically gets custody of children below 7 years
   - Visitation rights for non-custodial parent

4. **Maintenance/Alimony**:
   - Wife can claim maintenance under Section 125 CrPC
   - Amount depends on husband's income and wife's needs
   - Can be interim or permanent

5. **Property Division**:
   - No automatic 50-50 split in India
   - Streedhan (gifts to wife) belongs solely to wife
   - Depends on how property was acquired

**Applicable Laws**: Hindu Marriage Act, Special Marriage Act, Muslim Personal Law, Indian Divorce Act (for Christians)

This is a sensitive area requiring detailed legal consultation. Would you like to discuss your specific situation?`,
  },
];

const defaultResponse = `Thank you for your question. As an AI legal advisor for India, I can provide general legal information.

Based on your query, here are some general points:

1. **Understanding Your Rights**: Every Indian citizen has fundamental rights under the Constitution, including the right to equality, freedom, and constitutional remedies.

2. **Legal Process**: Most legal matters in India follow established procedures under various acts and codes. It's important to understand the specific laws applicable to your situation.

3. **Documentation**: Maintaining proper documentation is crucial for any legal matter. Keep records of all relevant papers, communications, and evidence.

4. **Time Limits**: Many legal actions have limitation periods. It's important to act within the prescribed time frame.

5. **Professional Consultation**: While I can provide general information, it's highly recommended to consult with a qualified lawyer for your specific situation. Use the "Find a Lawyer" feature to connect with verified legal professionals in your area.

**Important Disclaimer**: This is general legal information and not legal advice. Laws vary by state and circumstances. Always consult a qualified lawyer for advice specific to your situation.

Could you provide more details about your specific legal concern so I can give you more targeted information?`;

export async function POST(request: NextRequest) {
  try {
    const { chatId, messages } = await request.json();

    // Get the last user message
    const lastMessage = messages[messages.length - 1];
    const userQuery = lastMessage.content.toLowerCase();

    // Find matching response based on keywords
    let aiResponse = defaultResponse;

    for (const template of mockAIResponses) {
      if (template.keywords.some((keyword) => userQuery.includes(keyword))) {
        aiResponse = template.response;
        break;
      }
    }

    // Simulate AI processing delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return NextResponse.json({ message: aiResponse });
  } catch (error) {
    console.error('Error in legal-ai API:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
