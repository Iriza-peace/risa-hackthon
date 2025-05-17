import SubmitForm from "@/components/SubmitForm";

export default function Submit() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Submit a Complaint or Feedback</h1>
          <p className="text-gray-600">
            Use this form to submit your complaint or feedback about a public service.
            Your submission will be routed to the appropriate government agency.
          </p>
        </div>
        
        <SubmitForm />
        
        <div className="mt-8 bg-orange-50 border border-orange-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-orange-800 mb-2">What happens next?</h3>
          <ol className="list-decimal pl-5 space-y-2 text-gray-700">
            <li>Your complaint will be reviewed and assigned a ticket number.</li>
            <li>The complaint will be forwarded to the relevant government agency.</li>
            <li>You can track the status of your complaint in the "My Submissions" section.</li>
            <li>You will receive updates as your complaint is being processed.</li>
          </ol>
        </div>
      </div>
    </div>
  );
}