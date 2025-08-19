import Header from "@/components/organisms/Header";
import KanbanBoard from "@/components/organisms/KanbanBoard";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <KanbanBoard />
    </div>
  );
};

export default Dashboard;