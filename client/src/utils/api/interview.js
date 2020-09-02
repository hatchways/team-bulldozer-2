export default class InterviewApi {
  static getListInterviews() {
    return fetch("/interviews", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
  }

  static getListDifficultyLevels() {
    return fetch("/interviews/difficulty-levels", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
  }

  static createInterview(fields) {
    return fetch("/interviews", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(fields),
    });
  }
}
