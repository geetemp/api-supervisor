import Repairer, { RepairItem } from "../app/repairer";
// import { repairResult } from "../app/pipeline/proxyPipeline";

test("repairer test", () => {
  const obj = {
    data: {
      name: ["Null", "String"],
      edu: ["Array", { type: "Array", school: "String", address: "String" }],
      age: ["String"],
      new: {
        a: ["String"],
        b: ["Array", { type: "Array", school: "String", address: "Number" }]
      }
    }
  };
  const emptyArrayRepair = new RepairItem(
    left => {
      if (left === "Array") return true;
    },
    right => {
      if (right.type && right.type === "Array") return true;
    },
    (diff, keyPaths) => {
      console.log("keyPaths", keyPaths);
    }
  );
  const nullRepair = new RepairItem(
    left => {
      if (left === "Null") return true;
    },
    null,
    (diff, keyPaths) => {
      console.log(eval(`obj.${keyPaths.join(".")}=3`));
      console.log(obj);
    }
  );

  const repairer = new Repairer();
  repairer.regist(emptyArrayRepair);
  repairer.regist(nullRepair);
  repairer.execute(obj).after(() => {
    console.log("end");
  });
});

test("test hasDiff", () => {
  function hasDiff(delta) {
    if (Array.isArray(delta)) {
      hasDiff.yes = true;
    } else if (typeof delta === "object") {
      Object.keys(delta).forEach(key => {
        return hasDiff(delta[key]);
      });
    }
    return hasDiff.yes;
  }

  const result = hasDiff({
    data: {
      new: {
        c: {
          a: []
        }
      },
      a: {}
    }
  });
  console.log(result);
});

// test("test repairResult", () => {
//     repairResult()
// });
