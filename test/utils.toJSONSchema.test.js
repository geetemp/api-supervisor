import { toJSONSchema } from "../src/utils";

test("get json schema", () => {
  const jsonSchema = toJSONSchema(
    JSON.stringify({
      code: 0,
      msg: "OK",
      data: {
        profile: {
          id: "71",
          name: "name160422",
          position: "pos160422",
          phone: "15666666666",
          email: "abc@abc.com",
          age: "23",
          worktime: "14",
          sex: "1",
          marry: "1",
          city: "北京",
          forward_city: "苏州",
          salary_current: "33",
          salary_expect: "44",
          education: "本科",
          account_hh: "ci9871",
          appraisal: "",
          answer1: "",
          answer2: "",
          keyword: ""
        },
        faq: [
          {
            id: "60",
            question: "q1",
            answer: "a1",
            created: "1460620879000"
          },
          {
            id: "61",
            question: "q2",
            answer: "a2",
            created: "1460620879000"
          },
          {
            id: "62",
            question: "q1_update",
            answer: "a1_upate",
            created: "1460620860000"
          },
          {
            id: "124",
            question: "q1",
            answer: "a1",
            created: "1460713684000"
          },
          {
            id: "125",
            question: "q2",
            answer: "a2",
            created: "1460713684000"
          }
        ],
        edu: [
          {
            id: "46",
            school_name: "school_name1",
            major_name: "major_name1",
            begin_time: "201601",
            end_time: "201602",
            education: "本科"
          },
          {
            id: "47",
            school_name: "school_name1_update",
            major_name: "major_name1_update",
            begin_time: "201601",
            end_time: "201602",
            education: "本科"
          },
          {
            id: "78",
            school_name: "school_name1",
            major_name: "major_name1",
            begin_time: "201601",
            end_time: "201602",
            education: "本科"
          }
        ],
        job: [
          {
            id: "35",
            company_name: "company_name1",
            department: "department1",
            supervisor: "supervisor1",
            position: "position1",
            underling: "aa",
            begin_time: "201601",
            end_time: "201602",
            duty: "duty123"
          },
          {
            id: "36",
            company_name: "company_name1",
            department: "department1",
            supervisor: "supervisor1",
            position: "position1",
            underling: "12",
            begin_time: "201601",
            end_time: "201602",
            duty: "duty123"
          },
          {
            id: "67",
            company_name: "company_name1",
            department: "department1",
            supervisor: "supervisor1",
            position: "position1",
            underling: "12",
            begin_time: "201601",
            end_time: "201602",
            duty: "duty123"
          }
        ],
        project: [
          {
            id: "154",
            project_name: "project_name1",
            company_name: "company_name1",
            position: "position1",
            begin_time: "201601",
            end_time: "201602",
            description: "description1",
            duty: "duty1"
          },
          {
            id: "155",
            project_name: "project_name1",
            company_name: "company_name1_update",
            position: "position1",
            begin_time: "201601",
            end_time: "201602",
            description: "description1",
            duty: "duty1_update"
          },
          {
            id: "160",
            project_name: "project_name1",
            company_name: "company_name1",
            position: "position1",
            begin_time: "201601",
            end_time: "201602",
            description: "description1",
            duty: "duty1"
          },
          {
            id: "166",
            project_name: "project_name2",
            company_name: "company_name2_update",
            position: "position2",
            begin_time: "201602",
            end_time: "至今",
            description: "description2",
            duty: "duty2"
          }
        ]
      }
    })
  );
  console.log("jsonSchema", JSON.stringify(jsonSchema));
});
