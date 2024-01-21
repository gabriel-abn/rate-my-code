import { Feedback } from "@domain/entities";

export interface IFeedbackRepository {
  get(id: string): Promise<Feedback>;
  save(feedback: Feedback): Promise<boolean>;
  update(feedback: Feedback): Promise<boolean>;
  delete(id: string): Promise<boolean>;
  getAll(filter?: { user?: string; post?: string }): Promise<Feedback[]>;
}
