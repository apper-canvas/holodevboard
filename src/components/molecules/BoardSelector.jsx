import { useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const BoardSelector = ({ currentBoard = "Default Project", boards = ["Default Project"] }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
      >
        <ApperIcon name="Folder" size={16} />
        <span>{currentBoard}</span>
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
          <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-20 dark:bg-gray-800 dark:border-gray-600">
            <div className="py-2">
              {boards.map((board, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setIsOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center px-4 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700",
                    board === currentBoard && "bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400"
                  )}
                >
                  <ApperIcon name="Folder" size={16} className="mr-3" />
                  {board}
                  {board === currentBoard && (
                    <ApperIcon name="Check" size={16} className="ml-auto" />
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