import ApperIcon from "@/components/ApperIcon";
import BoardSelector from "@/components/molecules/BoardSelector";
import ThemeToggle from "@/components/molecules/ThemeToggle";
import Button from "@/components/atoms/Button";

const Header = ({ boards = [], selectedBoard = null, onBoardSelect = () => {} }) => {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 dark:bg-gray-900 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <ApperIcon name="Kanban" size={20} className="text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              DevBoard
            </h1>
          </div>
          
          <BoardSelector 
            boards={boards}
            selectedBoard={selectedBoard}
            onBoardSelect={onBoardSelect}
          />
        </div>

        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon">
            <ApperIcon name="Search" size={20} />
          </Button>
          
          <Button variant="ghost" size="icon">
            <ApperIcon name="Bell" size={20} />
          </Button>

          <ThemeToggle />
          
          <Button variant="ghost" size="icon">
            <ApperIcon name="Settings" size={20} />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;