import api from "../axios.config";

export interface FoundingAgreement {
  organizationId: number;
  organizationName: string;
  isFoundingPartner: boolean;
  foundingAcceptedAt: string | null;
  agreementVersion: string;
  effectiveDate: string;
  agreementHtml: string;
  agreementHash: string;
}

export interface AcceptFoundingAgreementRequest {
  claimId: number;
  token: string;
  signerFullName: string;
  signerRoleTitle: string;
  agreementVersion: string;
  agreementHash: string;
}

const foundingAgreementService = {
  getAgreement: async (organizationId: number): Promise<FoundingAgreement> => {
    const response = await api.get<FoundingAgreement>(
      `/public/organizations/${organizationId}/founding-agreement`,
    );
    return response.data;
  },

  acceptAgreement: async (
    organizationId: number,
    payload: AcceptFoundingAgreementRequest,
  ): Promise<{ message: string }> => {
    const response = await api.post<{ message: string }>(
      `/public/organizations/${organizationId}/founding-agreement/accept`,
      payload,
    );
    return response.data;
  },
};

export { foundingAgreementService };
