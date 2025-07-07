import { ScrollArea } from '@/components/ui/scroll-area';
import { UserListItem } from './UserListItem';

interface UserData {
  id: string;
  display_name?: string;
  first_name?: string;
  email?: string;
  created_at?: string;
  last_login?: string;
}

interface UserListProps {
  users: UserData[];
}

export function UserList({ users }: UserListProps) {
  if (users.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-4">
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
          />
        ))}
      </div>
    </ScrollArea>
  );
}