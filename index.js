import { WorkflowTemplateHelper } from "./workflow-template-helper.js";
import fs from "fs";

// NOTE: needed only for rationale DEV environment
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const prodHost = "https://tbms-dev.rationaletech.com";
const prodCookie =
  ".AspNetCore.Antiforgery.xR-qFIVXoIw=CfDJ8KGSw3UYzgdGlg69OHy5hX03Es1rZMCXUgrRhFsOABimVC1-FrIv4bKd6Uo_CdZ4JdH3-yD8OMRe29AMO06GFGYtabdCA4_0JibdqNMcf_KRB6khI8zpzirNbE6JFuSKPqbbUIdENlqDObIHGPIXSVw; ARRAffinity=c0f1fadb61c3d18a6499feaafbe69b67f3ce2e3b413fb0563204ff8b58e66c49; ARRAffinitySameSite=c0f1fadb61c3d18a6499feaafbe69b67f3ce2e3b413fb0563204ff8b58e66c49; auth_cookie=CfDJ8KGSw3UYzgdGlg69OHy5hX3tmKKmC5ADqmEGm6RfM8C4-cNz9gL5yumcPiLvKow40FAmfbrJ4N4U6vZer4RJEgEdAOgLv1rpui8kf-L-ZuWbHBJw5PJ476I1ANDoNYlpDQxN6Sac-zGEZCdUtqyPn587erfeEmBsEf68QuLbdp4Lgt1GczZ2VYoXpAnbwnIRHomM97c2-bIYmvgZzUJUOi8rUDKSpiyLgg5ahioo74wVy3hVN0E7pcOhintHc6TVNUytq8M1CzH0Sbed331_YwYfNi7r3YoVqglnu65306T36CsO-lekp9ZOAFoH0pLOmB_dypWP2tu6W4hcGq_vpkYLgiltLoUk3h9rtFdUER7pknd2rt0k--kQ3qR1B14PwUQZcpTjNxLTxLwXEhMgCn4fU8Hv4I71wAp8zeHi-I66HE6P_UD1jo4qwkL3PmthKQ; XSRF-TOKEN=CfDJ8KGSw3UYzgdGlg69OHy5hX0T1OBsYDxIa1txELlXZC_AtZYfaMkJxr32Aw0zDwMpvVCyI8Lmo4ehobaoATcEn4ioRPJ87twMSW97YtcaQOgxD0FRseNoWkleneqoCMbAb85LlWuM-UOYF6gk1BsFV88RqvboYUVECrPVzlKB5RZ65fbM_jzrQ4arjRa7_vIonA";

const qaHost = "http://localhost:5000";
const qaCookie =
  "auth_cookie=CfDJ8KGSw3UYzgdGlg69OHy5hX0V0EsAfsLxMW_xkPWAEN6wFQ1sUSX1qAzdKa6a4td1F88WocH0Je4S0vSEKVP1A9L5dUHSRXkWOsTSrn__TGtfxJTQeTu2P5q_X5ZsjkDhT0ahYh6mzhjypU49nps7cSht6zEfoUqzM1KtSr1xecQGwZytQy_Vga5HxlbCYMTfBD-RG8ZS2ol5fVuDd-9ZAtyYzCaffzJRGNFqt9sp7VLIqjhQbfExVeUK0tBAcUC72nWcxsst3rO8x5pX7beyUaCQEfu8Ldj9GkVCMXLV-8viWuO5snYEhF54S271poVjxGwc_cCiCCU2pwxoJ804DCBvyL_z7YpQJRUyYc4p1R-Vl9rPQRnw_EEdNKOaKSRg1WjfSUblhEzr36ZGPCue9pWlpFgvmF9-tny26I1FMwVVOCgifVeNfnKM8xxA9ok4Iw";

async function main() {
  const prodHelper = new WorkflowTemplateHelper(prodHost, prodCookie);
  const prodWorkflowTemplates = await prodHelper.getAllWorkflowTemplates();
  const prodDict = createDictionary(prodWorkflowTemplates);

  const qaHelper = new WorkflowTemplateHelper(qaHost, qaCookie);
  const qaWorkflowTemplates = await qaHelper.getAllWorkflowTemplates();
  const qaDict = createDictionary(qaWorkflowTemplates);

  const prodTemplateMatchers = await prodHelper.getTemplateMatchers();
  console.log(prodTemplateMatchers);

  for (const templateId in prodDict) {
    const qaId = qaDict[templateId]?.id;
    const yaml = await prodHelper.getYaml(prodDict[templateId].id);

    if (qaId) {
      qaHelper.updateTemplate(qaId, yaml);
    } else {
      qaHelper.createTemplate(templateId, yaml);
    }
  }
}

function createDictionary(workflowTemplates) {
  const result = {};

  for (let i = 0, len = workflowTemplates.length; i < len; i++) {
    const templateInfo = workflowTemplates[i];

    result[templateInfo.templateId] = templateInfo;
  }

  return result;
}

main().then(() => {
  console.log("---");
});
