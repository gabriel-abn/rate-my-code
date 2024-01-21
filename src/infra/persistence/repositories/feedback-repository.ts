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
        SELECT id, content, rating, rates_count as "rates", user_id, post_id
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
        SET content = $1, rating = $2, rates_count = $3
        WHERE id = $4;
      `,
      [feedback.content, feedback.rating, feedback.rates, feedback.id],
    );
  }

  async save(feedback: Feedback): Promise<boolean> {
    const { content, userId, postId } = feedback.getProps();

    return await this.database.execute(
      `
        INSERT INTO public.feedback (id, content, user_id, post_id) 
        VALUES ($1, $2, $3, $4);
      `,
      [feedback.id, content, userId, postId],
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

  async getAll(filter?: { user?: string; post?: string }): Promise<Feedback[]> {
    let feedbacks: any[];

    if (filter) {
      if (filter.user) {
        feedbacks = await this.database.query(
          `
          SELECT id, content, rating, rates_count as "rates", user_id, post_id
          FROM public.feedback 
          WHERE user_id = $1;
        `,
          [filter.user],
        );
      } else if (filter.post) {
        feedbacks = await this.database.query(
          `
          SELECT id, content, rating, rates_count as "rates", user_id, post_id
          FROM public.feedback
          WHERE post_id = $1;
        `,
          [filter.post],
        );
      }
    } else {
      feedbacks = await this.database.query(
        `
        SELECT id, content, rating, rates_count as "rates", user_id, post_id
        FROM public.feedback;
      `,
      );
    }

    return feedbacks.map((feedback) => {
      if (!feedback) return null;

      return Feedback.restore(feedback, feedback.id);
    });
  }
}

export default new FeedbackRepository(postgres);
