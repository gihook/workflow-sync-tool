import fetch from "node-fetch";

// NOTE: needed only for rationale DEV environment
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const prodHost = "https://tbms-dev.rationaletech.com";
const prodCookie =
  ".AspNetCore.Antiforgery.xR-qFIVXoIw=CfDJ8KGSw3UYzgdGlg69OHy5hX03Es1rZMCXUgrRhFsOABimVC1-FrIv4bKd6Uo_CdZ4JdH3-yD8OMRe29AMO06GFGYtabdCA4_0JibdqNMcf_KRB6khI8zpzirNbE6JFuSKPqbbUIdENlqDObIHGPIXSVw; ARRAffinity=c0f1fadb61c3d18a6499feaafbe69b67f3ce2e3b413fb0563204ff8b58e66c49; ARRAffinitySameSite=c0f1fadb61c3d18a6499feaafbe69b67f3ce2e3b413fb0563204ff8b58e66c49; auth_cookie=CfDJ8KGSw3UYzgdGlg69OHy5hX3tmKKmC5ADqmEGm6RfM8C4-cNz9gL5yumcPiLvKow40FAmfbrJ4N4U6vZer4RJEgEdAOgLv1rpui8kf-L-ZuWbHBJw5PJ476I1ANDoNYlpDQxN6Sac-zGEZCdUtqyPn587erfeEmBsEf68QuLbdp4Lgt1GczZ2VYoXpAnbwnIRHomM97c2-bIYmvgZzUJUOi8rUDKSpiyLgg5ahioo74wVy3hVN0E7pcOhintHc6TVNUytq8M1CzH0Sbed331_YwYfNi7r3YoVqglnu65306T36CsO-lekp9ZOAFoH0pLOmB_dypWP2tu6W4hcGq_vpkYLgiltLoUk3h9rtFdUER7pknd2rt0k--kQ3qR1B14PwUQZcpTjNxLTxLwXEhMgCn4fU8Hv4I71wAp8zeHi-I66HE6P_UD1jo4qwkL3PmthKQ; XSRF-TOKEN=CfDJ8KGSw3UYzgdGlg69OHy5hX0T1OBsYDxIa1txELlXZC_AtZYfaMkJxr32Aw0zDwMpvVCyI8Lmo4ehobaoATcEn4ioRPJ87twMSW97YtcaQOgxD0FRseNoWkleneqoCMbAb85LlWuM-UOYF6gk1BsFV88RqvboYUVECrPVzlKB5RZ65fbM_jzrQ4arjRa7_vIonA";

const qaHost = "http://localhost:5000";

async function main() {
  const prodWorkflowTemplates = await getAllWorkflowTemplates(prodHost);

  const yamlFiles = {};

  for (let i = 0, len = prodWorkflowTemplates.length; i < len; i++) {
    const templateInfo = prodWorkflowTemplates[i];
    const yaml = await getYaml(prodHost, templateInfo.id);

    yamlFiles[templateInfo.templateId] = yaml;
    console.log(yaml);
    console.log("=====");
  }
}

async function getAllWorkflowTemplates(host) {
  const response = await fetch(
    `${host}/api/workflow-templates/search-workflow-templates?pageNumber=1&numberOfResults=1000`,
    {
      headers: {
        accept: "application/json, text/plain, */*",
        "content-type": "application/json",
        "x-xsrf-token":
          "CfDJ8KGSw3UYzgdGlg69OHy5hX0T1OBsYDxIa1txELlXZC_AtZYfaMkJxr32Aw0zDwMpvVCyI8Lmo4ehobaoATcEn4ioRPJ87twMSW97YtcaQOgxD0FRseNoWkleneqoCMbAb85LlWuM-UOYF6gk1BsFV88RqvboYUVECrPVzlKB5RZ65fbM_jzrQ4arjRa7_vIonA",
        cookie: prodCookie,
      },
      body: "{}",
      method: "POST",
    },
  );

  const json = await response.json();

  return json.items.map((x) => ({ id: x.id, templateId: x.id, name: x.name }));
}

async function getYaml(host, id) {
  const response = await fetch(
    `${host}/workflow-templates/yaml-template/${id}`,
    {
      headers: {
        accept: "application/json, text/plain, */*",
        "content-type": "text/plain; charset=utf-8",
        cookie: prodCookie,
      },
      body: null,
      method: "GET",
    },
  );

  const yaml = response.text();

  return yaml;
}

main().then(() => {
  console.log("---");
});
