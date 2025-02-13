
const Announcements = () => {
  return (
    <div className="bg-white border p-4 rounded-md">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Announcements</h1>
        <span className="text-xs text-gray-400">View All</span>
      </div>
      <div className="flex flex-col gap-4 mt-4">
        {/* End-Term Exams Announcement */}
        <div className="bg-lamaSkyLight rounded-md p-4">
          <div className="flex items-center justify-between">
            <h2 className="font-medium">End-Term Exams: Important Dates</h2>
            <span className="text-xs text-gray-400 bg-white rounded-md px-1 py-1">
              2024-12-25
            </span>
          </div>
          <p className="text-sm text-gray-400 mt-1">
            Please note that the end-term exams will begin on January 10th, 2025. Ensure that all students are well-prepared and have reviewed the exam schedules posted on the notice board. Teachers are requested to submit their exam papers by January 5th.
          </p>
        </div>

        {/* Teacher Marks Submission */}
        <div className="bg-lamaPurpleLight rounded-md p-4">
          <div className="flex items-center justify-between">
            <h2 className="font-medium">Marks Submission Deadline</h2>
            <span className="text-xs text-gray-400 bg-white rounded-md px-1 py-1">
              2024-12-23
            </span>
          </div>
          <p className="text-sm text-gray-400 mt-1">
            All teachers are reminded to upload their student&apos;s marks for the current term into the system by the 30th of December. Failure to do so will result in a delay of the report card preparation.
          </p>
        </div>

        {/* Subject Change Announcement */}
        <div className="bg-lamaYellowLight rounded-md p-4">
          <div className="flex items-center justify-between">
            <h2 className="font-medium">Subject Assignments Update</h2>
            <span className="text-xs text-gray-400 bg-white rounded-md px-1 py-1">
              2024-12-22
            </span>
          </div>
          <p className="text-sm text-gray-400 mt-1">
            Effective from the start of next term, Mr. John Doe will be assigned to teach Chemistry for Form 4, and Ms. Jane Smith will now be teaching Geography for Form 3. Kindly update your schedules accordingly.
          </p>
        </div>

        {/* Parent-Teacher Meetings */}
        <div className="bg-lamaSkyLight rounded-md p-4">
          <div className="flex items-center justify-between">
            <h2 className="font-medium">Parent-Teacher Meeting: January 5, 2025</h2>
            <span className="text-xs text-gray-400 bg-white rounded-md px-1 py-1">
              2024-12-20
            </span>
          </div>
          <p className="text-sm text-gray-400 mt-1">
            The first Parent-Teacher meeting for the new year will take place on January 5th, 2025, from 10 AM to 1 PM in the school hall. Parents are encouraged to attend to discuss their child’s progress with subject teachers.
          </p>
        </div>

        {/* New Term Reminders */}
        <div className="bg-lamaPurpleLight rounded-md p-4">
          <div className="flex items-center justify-between">
            <h2 className="font-medium">New Term Reminders</h2>
            <span className="text-xs text-gray-400 bg-white rounded-md px-1 py-1">
              2024-12-21
            </span>
          </div>
          <p className="text-sm text-gray-400 mt-1">
            The new term will commence on January 8th, 2025. All students are reminded to come in full uniform, and teachers are to ensure that their classrooms are prepared for the first day. The first assembly will be held at 8:00 AM sharp.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Announcements;
