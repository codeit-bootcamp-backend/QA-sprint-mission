export async function isLiked(findId, schema) {
  // 좋아요를 했는지 안 했는지 확인하기 위해 제품 찾아오기
  const dbResponse = await schema.findUnique({
    where: { id: findId },
    include: {
      favoriteUser: true,
    },
  });

  const isLiked = dbResponse.favoriteUser.some((user) => user.id === findId);

  return isLiked;
}
