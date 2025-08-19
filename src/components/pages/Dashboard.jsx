import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Header from "@/components/organisms/Header";
import KanbanBoard from "@/components/organisms/KanbanBoard";
import { boardService } from '@/services/api/boardService';

const Dashboard = () => {
  const [boards, setBoards] = useState([]);
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [loading, setLoading] = useState(true);

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
    toast.success(`Switched to ${board.name}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading boards...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header 
        boards={boards}
        selectedBoard={selectedBoard}
        onBoardSelect={handleBoardSelect}
      />
      {selectedBoard && <KanbanBoard boardId={selectedBoard.Id} />}
    </div>
  );
};

export default Dashboard;