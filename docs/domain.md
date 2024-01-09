# Domain

## User

Users are the main actors of the system. They can be either a developer, a mentor/instructor or an admin.

For being a developer, an user must have a **Github**, **Gitlab** or **Bitbucket** account so that he/she can connect to the system using OAuth2 and authorize the system to access his/her repositories.

For being a mentor/instructor, the user can sign up using his/her email and password normally, but he/she need to have some certifications and experience in the area he/she wants to teach. The system will ask for some information about the user's experience and certifications and they'll be validated by the system's admins.

Every user will have a profile page where he/she can see his/her information and edit it. The user can also see his/her posts, feedbacks and code snippets.

The user's relevance will be measured by his/her rating. The higher the rating, the more visibility the user will have. The rating will be calculated by the average of the ratings of the user's posts and feedbacks.

### Developer

A developer is an user that has a Github, Gitlab or Bitbucket account and has authorized the system to access his/her repositories. The system will get the user's repositories and will show them on the user's profile page. The user can choose which repositories he/she wants to show on his/her profile page. Developers can either create posts and feedbacks or rate other developers' posts and feedbacks.

### Mentor/Instructor

A mentor/instructor is an user that has some certifications and experience in the area he/she wants to teach. The system will ask for some information about the user's experience and certifications and they'll be validated by the system's admins. The user can choose which information he/she wants to show on his/her profile page. Mentors/instructors can either create posts and feedbacks or rate other developers' posts and feedbacks.

Every mentors' and instructors' posts and feedbacks will be highlighted on the feed and will have more visibility as they are meant to be more relevant.

### Admin

An admin is an user that has access to the system's administration panel. He/she can manage the system's users, posts, feedbacks, etc.

---

## Feed

The feed is the main page of the system. It's where the user can see the latest updates from the people he/she follows and some recommendations as well. These updates can be either a code snippet, a feedback or article post, or a post from the system's admins.

### Post

A post is a text written by an user. Every post can contain some code snippets from an user's repository, images, links, etc. The text can have Markdown tags, so the post may get more readable and intuitive. Every post is meant to be either a feedback request or an informative article. It can be rated by other developers and mentors. This rate will be used as a mesure for its relevance. The higher the rating, the more visibility the post will have.

For the posts that are meant to be feedback requests, the user can choose which developers and mentors he/she wants to send the request to. The system will send a notification to the chosen users and they'll be able to see the post and give a feedback.

For the posts that are meant to be informative articles, the user can choose tag it, so all users that marked the tag as interesting will receive a notification about the post.

### Feedback

A feedback is a text written by any user. Every feedback is related to a post as a response and can be rated by other mentors/instructors and developers. This rate will be used as a mesure for its relevance. The higher the rating, the more visibility the feedback will have and the more reputation the author will gain.

---

Initially, users will be able to pin a limited number of repositories from their GitHub, GitLab, and BitBucket profiles. From there, other users will be able to rate the code of these repositories, so that the user being rated can improve their programming skills.

The first stage of code review will be done by a system of the platform itself, which can provide inline feedback on the code. For example:

```typescript
export class Usuario {
  private na: string;
  private eml: string;
  private pasw: string;

  constructor(na: string, eml: string, pasw: string) {
    this.na = na;
    this.eml = eml;
    this.pasw = pasw;
  }

  public get na(): string {
    return this.na;
  }

  public get eml(): string {
    return this.eml;
  }

  public get pasw(): string {
    return this.pasw;
  }
}

// 1. Use more descriptive variable names
// 2. Use English nomenclature
```

In the code above, the system imports a repository from one of the platforms, and performs a static analysis of the code, providing inline feedback on the code. In the example above, the system suggests that the user use more descriptive variable names and use English nomenclature. These analyses will be done through an API that will be developed by the RateMyCode team, considering that they will not be more detailed analyses of the code, such as cyclomatic complexity analysis for example, but simpler analyses, such as nomenclature analysis.

The second stage of code review will be done by other users of the platform, who will be able to rate the code in a more subjective way, providing feedback on the code.

We will have types of reviews:

- **Code reviews**: The code review will be intended to evaluate the code itself, that is, comments on the structure of the code, nomenclature, complexity, etc.

- **Test reviews**: The test review will be intended to evaluate the code tests, that is, comments on test coverage, quality of tests, etc.

- **Architecture reviews**: This will be more subjective, as it will be intended to evaluate the code architecture, that is, comments on modularization, separation of responsibilities, etc.

- **Solution reviews**: The solution review will be intended to evaluate the solution to the proposed problem, that is, comments on the efficiency of the solution, provided that the rated user better describes what was the problem that was, or is being solved.

### Review Credibility

For reviews to have credibility, users who rate other users' code will have to have a certain level of reputation, which will be acquired from positive reviews they receive from other users. In addition, users who rate other users' code will have to have a certain level of knowledge in the programming language of the code being reviewed, which will be acquired from positive reviews they receive from other users.

It may be possible to send certifications and professional achievements to the platform, so that the user can acquire reputation and knowledge points.
