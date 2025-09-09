function getLearnerData(courseInfo, assignmentGroup, learnerSubmissions) {
 
  if (assignmentGroup.course_id !== courseInfo.id) {
    try {
      throw new Error("This assignment group doesn't belong to this course!");
    } catch (error) {
      console.error(error.message);
      return [];
    }
  }

  var finalGrades = [];

  var learnersPoints = {};

  for (var i = 0; i < learnerSubmissions.length; i++) {
    var submission = learnerSubmissions[i];
    var assignmentId = submission.assignment_id;
    var learnerId = submission.learner_id;
    var submissionScore = submission.submission.score;
    var submittedAt = submission.submission.submitted_at;

    var currentAssignment;
    for (var j = 0; j < assignmentGroup.assignments.length; j++) {
      if (assignmentGroup.assignments[j].id === assignmentId) {
        currentAssignment = assignmentGroup.assignments[j];
        break;
      }
    }

    if (!currentAssignment) {
      console.warn(
        "Skipping a submission because the assignment ID " +
          assignmentId +
          " wasn't found."
      );
      continue;
    }

    var now = new Date();
    var dueDate = new Date(currentAssignment.due_at);
    if (now < dueDate) {
      continue;
    }

    if (currentAssignment.points_possible === 0) {
      console.warn(
        "Warning: Assignment " +
          currentAssignment.name +
          " has 0 points possible. Skipping score calculation."
      );
      continue;
    }

    var submissionDate = new Date(submittedAt);
    if (submissionDate > dueDate) {
      submissionScore =
        submissionScore - currentAssignment.points_possible * 0.1;
    }

    if (submissionScore < 0) {
      submissionScore = 0;
    }

    if (!learnersPoints[learnerId]) {
      learnersPoints[learnerId] = {
        totalEarned: 0,
        totalPossible: 0,
        assignments: {},
      };
    }

    learnersPoints[learnerId].totalEarned += submissionScore;
    learnersPoints[learnerId].totalPossible +=
      currentAssignment.points_possible;

    var assignmentPercentage =
      submissionScore / currentAssignment.points_possible;
    learnersPoints[learnerId].assignments[assignmentId] = assignmentPercentage;
  }

  for (var id in learnersPoints) {
    var learner = learnersPoints[id];

    var finalAvg = learner.totalEarned / learner.totalPossible;

    var learnerResult = {
      id: parseInt(id),
      avg: parseFloat(finalAvg.toFixed(2)),
    };

    for (var assignment in learner.assignments) {
      learnerResult[assignment] = parseFloat(
        learner.assignments[assignment].toFixed(2)
      );
    }

    finalGrades.push(learnerResult);
  }

  return finalGrades;
}

const courseInfo = {
  id: 451,
  name: "Introduction to JavaScript",
};

const assignmentGroup = {
  id: 12345,
  name: "Fundamentals of JavaScript",
  course_id: 451,
  group_weight: 25,
  assignments: [
    {
      id: 1,
      name: "A1",
      due_at: "2025-01-25T23:59:00Z",
      points_possible: 50,
    },
    {
      id: 2,
      name: "A2",
      due_at: "2025-02-27T23:59:00Z",
      points_possible: 100,
    },
    {
      id: 3,
      name: "A3",
      due_at: "2025-03-30T23:59:00Z",
      points_possible: 150,
    },
  ],
};

const learnerSubmissions = [
  {
    learner_id: 125,
    assignment_id: 1,
    submission: {
      submitted_at: "2025-01-24T03:24:00Z",
      score: 47,
    },
  },
  {
    learner_id: 125,
    assignment_id: 2,
    submission: {
      submitted_at: "2025-03-01T03:24:00Z",
      score: 95,
    },
  },
  {
    learner_id: 125,
    assignment_id: 3,
    submission: {
      submitted_at: "2025-02-10T03:24:00Z",
      score: 140,
    },
  },
  {
    learner_id: 132,
    assignment_id: 1,
    submission: {
      submitted_at: "2025-01-29T03:24:00Z",
      score: 30,
    },
  },
  {
    learner_id: 132,
    assignment_id: 2,
    submission: {
      submitted_at: "2025-03-01T03:24:00Z",
      score: 80,
    },
  },
  {
    learner_id: 132,
    assignment_id: 3,
    submission: {
      submitted_at: "2025-02-10T03:24:00Z",
      score: 120,
    },
  },
];

var finalResult = getLearnerData(
  courseInfo,
  assignmentGroup,
  learnerSubmissions
);

console.log(finalResult);
