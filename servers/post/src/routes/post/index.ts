import { router } from '../../trpc';
import createPost from './create';
import viewAll from './viewAll';

const postRouter = router({
  createPost,
  viewAll,
});

export default postRouter;
