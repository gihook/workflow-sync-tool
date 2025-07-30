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
          cookie: this.cookie,
        },
        body: "{}",
        method: "POST",
      },
    );

    const json = await response.json();

    return json.items.map((x) => ({
      id: x.id,
      templateId: x.templateId,
      name: x.name,
    }));
  }

  async updateTemplate(id, yaml) {
    const response = await fetch(
      `${this.host}/api/workflow-templates/${id}/store-yaml-template`,
      {
        headers: {
          accept: "application/json, text/plain, */*",
          "content-type": "text/plain",
          cookie: this.cookie,
        },
        body: yaml,
        method: "POST",
      },
    );

    const success = response.status == 200;

    if (!success) throw new Error("Unable to update template " + id);
  }

  async createTemplate(templateId, yaml) {
    await fetch(
      `${this.host}/api/workflow-templates/create-workflow-template-yaml`,
      {
        headers: {
          accept: "application/json, text/plain, */*",
          "accept-language": "en-US,en;q=0.9",
          "content-type": "text/plain",
          cookie: this.cookie,
        },
        body: yaml,
        method: "POST",
      },
    );

    const success = response.status == 200;

    if (!success) throw new Error("Unable to create template " + templateId);
  }

  async updateTemplateMatchers(yaml) {
    const response = await fetch(
      `${this.host}/api/workflow-templates/set-yaml-selector-configuration`,
      {
        headers: {
          accept: "application/json, text/plain, */*",
          "content-type": "text/plain",
          cookie: this.cookie,
        },
        body: yaml,
        method: "POST",
      },
    );

    const success = response.status == 200;

    if (!success) throw new Error("Unable to update template matchers");
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
        method: "GET",
      },
    );

    const yaml = response.text();

    return yaml;
  }

  async getTemplateMatchers() {
    const response = await fetch(
      `${this.host}/workflow-templates/template-matchers-yaml`,
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
