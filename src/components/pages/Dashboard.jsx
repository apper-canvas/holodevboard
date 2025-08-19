import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { boardService } from "@/services/api/boardService";
import Loading from "@/components/ui/Loading";
import KanbanBoard from "@/components/organisms/KanbanBoard";
import Header from "@/components/organisms/Header";

const Dashboard = () => {
  const [boards, setBoards] = useState([]);
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadBoards();
  }, []);

const loadBoards = async () => {
    try {
      setLoading(true);
      const boardsData = await boardService.getAll();
      setBoards(boardsData);
      if (boardsData.length > 0) {
        setSelectedBoard(boardsData[0]);
      }
    } catch (error) {
      console.error('Error loading boards:', error);
      toast.error('Failed to load boards');
    } finally {
      setLoading(false);
    }
  };

  const handleBoardSelect = (board) => {
    setSelectedBoard(board);
  };

  if (loading) {
    return <Loading />;
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
      {selectedBoard && (
        <KanbanBoard 
          boardId={selectedBoard.id} 
          searchQuery={searchQuery} 
        />
      )}
    </div>
  );
};

export default Dashboard;