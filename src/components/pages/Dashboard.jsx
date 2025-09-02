import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { boardService } from "@/services/api/boardService";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import KanbanBoard from "@/components/organisms/KanbanBoard";
import Header from "@/components/organisms/Header";

const Dashboard = () => {
  const [boards, setBoards] = useState([]);
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  useEffect(() => {
    loadBoards();
  }, []);

const loadBoards = async () => {
    try {
      setLoading(true);
      setError(null);
      const boardsData = await boardService.getAll();
      setBoards(boardsData);
      if (boardsData.length > 0) {
        setSelectedBoard(boardsData[0]);
      }
    } catch (error) {
      console.error('Error loading boards:', error);
      setError(error.message || 'Failed to load boards');
      toast.error('Failed to load boards');
    } finally {
      setLoading(false);
    }
  };

  const handleBoardSelect = (board) => {
    setSelectedBoard(board);
  };

if (loading) {
    return <Loading message="Loading your boards..." />;
  }

  if (error) {
    return (
      <Error 
        message="Failed to Load Boards"
        description={error}
        onRetry={loadBoards}
      />
    );
  }

return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header 
        boards={boards}
        selectedBoard={selectedBoard}
        onBoardSelect={handleBoardSelect}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      {selectedBoard ? (
<KanbanBoard 
          boardId={selectedBoard.Name} 
          searchQuery={searchQuery} 
        />
      ) : boards.length === 0 ? (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No boards found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Create your first board to get started
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Dashboard;