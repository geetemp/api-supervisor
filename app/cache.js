import Store from "../lib/Store";

const cache = new Store(
  {
    projects: (projects, action) => {
      const { type, payload } = action;
      if (type === "add") {
        return [...projects, payload];
      } else if (type === "update") {
        for (let i = 0; i < projects.length; i++) {
          const pro = projects[i];
          if (pro.identity == payload.identity) {
            projects[i] = { ...pro, ...payload };
            break;
          }
        }
        return [...projects];
      } else if (type === "init") {
        return [...payload];
      }
    }
  },
  { projects: [] }
);

export default cache;
