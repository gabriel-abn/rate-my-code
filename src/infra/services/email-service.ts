import SendEmail from "@application/protocols/services/send-email";

class EmailService implements SendEmail.Service {
  emails: { to: string; template: string; data: Record<string, any> }[];

  constructor() {
    this.emails = [];
  }

  async send(data: {
    to: string;
    template: string;
    data: Record<string, any>;
  }): Promise<boolean> {
    this.emails.push(data);

    return true;
  }
}

export default new EmailService();
