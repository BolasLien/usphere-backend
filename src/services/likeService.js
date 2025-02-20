const db = require("../utils/db");

exports.toggleLike = async (userId, entityId, entityType, token) => {
  const { data: existingData, error: findError } = await db
    .from("likes")
    .select("*")
    .eq("user_id", userId)
    .eq(`${entityType}_id`, entityId)
    .setHeader("Authorization", `Bearer ${token}`);

  // 如果不是找不到資料的錯誤，就拋出錯誤
  if (findError && findError.code !== "PGRST116") {
    throw new Error(findError.message);
  }

  if (existingData[0]) {
    // 按讚 或 收回讚
    const { error: deleteError } = await db
      .from("likes")
      .update({ is_liked: !existingData[0].is_liked })
      .eq("user_id", userId)
      .eq("id", existingData[0].id);

    if (deleteError) {
      throw new Error(deleteError.message);
    }

    return { is_liked: !existingData[0].is_liked };
  } else {
    // 新增讚
    const { error: insertError } = await db.from("likes").insert({
      user_id: userId,
      [`${entityType}_id`]: entityId,
      is_liked: true,
    });

    if (insertError) {
      throw new Error(insertError.message);
    }

    return { is_liked: true };
  }
};

// 查詢特定 entity_id 的 like 數量
exports.getLikeCount = async (entityId, entityType) => {
  const { count, error } = await db
    .from("likes")
    .select("*", { count: "exact", head: true })
    .eq(`${entityType}_id`, entityId)
    .eq("is_liked", true);

  if (error) {
    throw error;
  }
  return count;
};
