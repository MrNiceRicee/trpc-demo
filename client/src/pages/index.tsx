import { data } from 'autoprefixer';
import { useAtom } from 'jotai';
import { trpc } from '../api/_trpc';
import BasicCard from '../components/BasicCard';
import LoadingBlock from '../components/LoadingBlock';
import { userAtom } from '../hooks/User';
import CreatePost from './CreatePost';

function Home() {
  const [userId, setUserId] = useAtom(userAtom);
  const posts = trpc.posts.viewAll.useInfiniteQuery(
    [
      'infinitePost',
      {
        limit: 1,
      },
    ],
    {
      getNextPageParam: (lastPage) => {
        return lastPage.cursor;
      },
    }
  );

  const users = trpc.users.getUsers.useQuery({
    name: undefined,
    username: undefined,
  });

  const handleUserInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setUserId((prev) => {
      return {
        ...prev,
        id: value,
      };
    });
  };

  return (
    <div className="w-screen">
      <h1 className="text-center text-4xl">Home</h1>
      <div className="grid grid-cols-2 gap-4 px-4">
        <div className="flex flex-col items-center ">
          <h2 className="text-2xl">Posts</h2>
          <CreatePost />
          {posts.isLoading ? (
            <LoadingBlock text="loading osts" />
          ) : (
            <ul className="flex flex-col gap-3">
              {posts?.data?.pages.map((page) => {
                return page?.data?.map((post) => {
                  return (
                    <li key={post.id} className="rounded-md bg-stone-200 p-4">
                      <BasicCard
                        title={post.author.name}
                        content={post.content}
                        footer={
                          <span className="text-sm text-zinc-500">
                            @{post.author.username}
                          </span>
                        }
                      />
                    </li>
                  );
                });
              })}
            </ul>
          )}
        </div>
        <div className="flex flex-col items-center">
          <h2 className="text-2xl">Users</h2>
          <div className="flex flex-col gap-1 py-2">
            <label
              htmlFor="TokenId"
              className="block text-sm font-medium text-zinc-700"
            >
              Token ID
            </label>
            <input
              name="TokenId"
              type="text"
              value={userId.id}
              onChange={handleUserInput}
              style={{
                boxShadow: `
                inset 0 1px 4px 0 hsl(0 0% 70%),
                inset 0 1px 0px 0px hsl(0 0% 50%),
                inset 0 -1px 0px 0px hsl(0 0% 80%)
              `,
              }}
              className="block w-full rounded-md border border-none bg-gradient-to-b from-stone-100 to-stone-200 px-4 py-2 font-mono focus:outline-none focus:ring-2 focus:ring-stone-500 focus:ring-offset-2 focus:ring-offset-stone-100"
            />
          </div>
          {users.isLoading ? (
            <LoadingBlock text="loading users" />
          ) : (
            <ul className="flex flex-col gap-3">
              {users.data?.users?.map((user) => (
                <li key={user.id} className="rounded-md bg-stone-200 p-4">
                  <BasicCard
                    title={user.name}
                    content={<span>@{user.username}</span>}
                    footer={
                      <code className="rounded-md bg-stone-500 px-2 py-1 text-zinc-200">
                        {user.id}
                      </code>
                    }
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
