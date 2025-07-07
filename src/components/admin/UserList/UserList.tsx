import { ScrollArea } from '@/components/ui/scroll-area';
import { UserListItem } from './UserListItem';

interface UserData {
  id: string;
  display_name?: string;
  first_name?: string;
  email?: string;
  role?: string;
  created_at?: string;
  last_login?: string;
}

interface UserListProps {
  users: UserData[];
  showUsers: boolean;
}

export function UserList({ users, showUsers }: UserListProps) {
  if (users.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-4 animate-fade-in">
        No users found
      </div>
    );
  }

  return (
    <ScrollArea className="h-[560px]">
      <div className="space-y-3 pr-4">
        {users.map((user, index) => (
          <UserListItem
            key={user.id}
            user={user}
            index={index}
            showUsers={showUsers}
          />
        ))}
      </div>
    </ScrollArea>
  );
}