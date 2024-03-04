import bgBody from '../../public/linebackground.png';

export const bg = {
  styles: {
    global: (props) => ({
      body: {
        bgImage: bgBody,
        bgSize: "cover",
        bgPosition: "center center",
      },
    }),
  },
};
