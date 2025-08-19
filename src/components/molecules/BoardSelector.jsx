import { useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const BoardSelector = ({ boards = [], selectedBoard = null, onBoardSelect = () => {} }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleBoardSelect = (board) => {
    setIsOpen(false);
    onBoardSelect(board);
  };

  if (!selectedBoard) {
    return (
      <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
        No boards available
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
      >
        <div 
          className="w-3 h-3 rounded-full mr-1"
          style={{ backgroundColor: selectedBoard.color }}
        />
        <ApperIcon name="Folder" size={16} />
        <span>{selectedBoard.name}</span>
        <ApperIcon 
          name="ChevronDown" 
          size={16} 
          className={cn(
            "transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-20 dark:bg-gray-800 dark:border-gray-600">
            <div className="py-2">
              <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-gray-600">
                Switch Board
              </div>
              {boards.map((board) => (
                <button
                  key={board.Id}
                  onClick={() => handleBoardSelect(board)}
                  className={cn(
                    "w-full flex items-center px-4 py-3 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors",
                    board.Id === selectedBoard.Id && "bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400"
                  )}
                >
                  <div 
                    className="w-3 h-3 rounded-full mr-3"
                    style={{ backgroundColor: board.color }}
                  />
                  <div className="flex-1">
                    <div className="font-medium">{board.name}</div>
                    {board.description && (
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {board.description}
                      </div>
                    )}
                  </div>
                  {board.Id === selectedBoard.Id && (
                    <ApperIcon name="Check" size={16} className="ml-2" />
                  )}
                </button>
              ))}
              <hr className="my-2 border-gray-200 dark:border-gray-600" />
              <button className="w-full flex items-center px-4 py-2 text-sm text-left text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700">
                <ApperIcon name="Plus" size={16} className="mr-3" />
                Create New Board
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default BoardSelector;