import fetch from "node-fetch";

export class WorkflowTemplateHelper {
  constructor(host, cookie) {
    this.host = host;
    this.cookie = cookie;
  }

  async getAllWorkflowTemplates() {
    const response = await fetch(
      `${this.host}/api/workflow-templates/search-workflow-templates?pageNumber=1&numberOfResults=1000`,
      {
        headers: {
          accept: "application/json, text/plain, */*",
          "content-type": "application/json",
          "x-xsrf-token":
            "CfDJ8KGSw3UYzgdGlg69OHy5hX0T1OBsYDxIa1txELlXZC_AtZYfaMkJxr32Aw0zDwMpvVCyI8Lmo4ehobaoATcEn4ioRPJ87twMSW97YtcaQOgxD0FRseNoWkleneqoCMbAb85LlWuM-UOYF6gk1BsFV88RqvboYUVECrPVzlKB5RZ65fbM_jzrQ4arjRa7_vIonA",
          cookie: this.cookie,
        },
        body: "{}",
        method: "POST",
      },
    );

    const json = await response.json();

    return json.items.map((x) => ({
      id: x.id,
      templateId: x.id,
      name: x.name,
    }));
  }

  async getYaml(id) {
    const response = await fetch(
      `${this.host}/workflow-templates/yaml-template/${id}`,
      {
        headers: {
          accept: "application/json, text/plain, */*",
          "content-type": "text/plain; charset=utf-8",
          cookie: this.cookie,
        },
        body: null,
        method: "GET",
      },
    );

    const yaml = response.text();

    return yaml;
  }
}
