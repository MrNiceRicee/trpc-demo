import { data } from 'autoprefixer';
import { trpc } from '../api/_trpc';

function Home() {
  const posts = trpc.posts.viewAll.useQuery({
    cursor: undefined,
  });

  const users = trpc.users.getUsers.useQuery({
    name: undefined,
    username: undefined,
  });

  return (
    <div className="h-screen w-screen bg-stone-300">
      <h1 className="text-center text-4xl">Home</h1>
      <div className="grid grid-cols-2 gap-4 px-4">
        {posts.isLoading ? (
          <div className="rounded-md bg-stone-200 p-4">
            <h2 className="text-2xl">Post is Loading</h2>
          </div>
        ) : (
          <ul className="flex flex-col gap-3">
            {posts?.data?.data?.map((post) => (
              <div key={post.id} className="rounded-md bg-stone-200 p-4">
                <h2 className="text-2xl">{post.content}</h2>
                {/* date to human readable */}
                <p className="text-sm">
                  {new Date(post.createdAt).toLocaleTimeString()}
                </p>
                <p className="text-sm">
                  {post.author.name + ' '}
                  <span className="text-gray-500">@{post.author.username}</span>
                </p>
              </div>
            ))}
          </ul>
        )}
        {users.isLoading ? (
          <div className="relative flex items-center justify-center overflow-hidden rounded-md bg-stone-200 p-1">
            <div
              className="animate-spin-slow absolute inset-0 top-1/4 left-1/2 h-1/2 w-3/4
              origin-left -translate-y-1/2
              -translate-x-1/2 rounded-full
              bg-sky-700 mix-blend-color-burn
            "
            aria-hidden="true"
            // aria for this is a loading spinner
            aria-label="Loading"
            />
            <div className=" z-10 flex h-full w-full items-center justify-center rounded-sm bg-stone-100">
              <h2 className="text-2xl">loading users</h2>
            </div>
          </div>
        ) : (
          <ul className="flex flex-col gap-3">
            {users.data?.users?.map((user) => (
              <div
                key={user.name + user.username}
                className="rounded-md bg-stone-200 p-4"
              >
                <h2 className="text-2xl">{user.name}</h2>
                <p className="text-sm">@{user.username}</p>
              </div>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Home;
