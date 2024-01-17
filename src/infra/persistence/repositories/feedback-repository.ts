import { IFeedbackRepository } from "@application/repositories";
import { Feedback } from "@domain/entities";
import { RelationalDatabase } from "../common";

import postgres from "../database/postgres";

class FeedbackRepository implements IFeedbackRepository {
  constructor(private database: RelationalDatabase) {}

  async get(id: string): Promise<Feedback> {
    const feedback = await this.database
      .query(
        `
        SELECT * 
        FROM public.feedback 
        WHERE id = $1;
      `,
        [id],
      )
      .then((result) => result[0]);

    return Feedback.restore(feedback, id);
  }

  async update(feedback: Feedback): Promise<boolean> {
    return await this.database.execute(
      `
        UPDATE public.feedback 
        SET content = $1, rating = $2 
        WHERE id = $3;
      `,
      [feedback.content, feedback.rating, feedback.id],
    );
  }

  async save(feedback: Feedback): Promise<boolean> {
    const { content, rating, userId, postId } = feedback.getProps();

    return await this.database.execute(
      `
        INSERT INTO public.feedback (id, content, rating, user_id, post_id) 
        VALUES ($1, $2, $3, $4, $5);
      `,
      [feedback.id, content, rating, userId, postId],
    );
  }

  async delete(id: string): Promise<boolean> {
    return await this.database.execute(
      `
        DELETE FROM public.feedback 
        WHERE id = $1;
      `,
      [id],
    );
  }

  async getAll(): Promise<Feedback[]> {
    const feedbacks = await this.database.query(
      `
        SELECT * 
        FROM public.feedback;
      `,
    );

    return feedbacks.map((feedback) => {
      if (!feedback) return null;

      return Feedback.restore(feedback, feedback.id);
    });
  }
}

export default new FeedbackRepository(postgres);
