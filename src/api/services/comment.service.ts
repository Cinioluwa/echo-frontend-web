import api from "../axios.config";
import type {
  Comment,
  CreateCommentRequest,
  UpdateCommentRequest,
  PaginatedResponse,
  PaginationParams,
} from "../types";

/**
 * Comment Service
 * Handles comments on pings and waves
 */
const commentService = {
  /**
   * Get comments for a specific ping or wave
   * @param targetType Type of target (ping or wave)
   * @param targetId Target ID
   * @param params Pagination parameters
   * @returns Paginated list of comments
   */
  getComments: async (
    targetType: "ping" | "wave",
    targetId: string,
    params?: PaginationParams
  ): Promise<PaginatedResponse<Comment>> => {
    const response = await api.get<PaginatedResponse<Comment>>(
      `/${targetType}s/${targetId}/comments`,
      { params }
    );
    return response.data;
  },

  /**
   * Get a single comment by ID
   * @param id Comment ID
   * @returns Comment details
   */
  getCommentById: async (id: string): Promise<Comment> => {
    const response = await api.get<Comment>(`/comments/${id}`);
    return response.data;
  },

  /**
   * Create a new comment
   * @param data Comment creation data
   * @returns Created comment
   */
  createComment: async (data: CreateCommentRequest): Promise<Comment> => {
    const response = await api.post<Comment>("/comments", data);
    return response.data;
  },

  /**
   * Update an existing comment
   * @param id Comment ID
   * @param data Updated comment data
   * @returns Updated comment
   */
  updateComment: async (
    id: string,
    data: UpdateCommentRequest
  ): Promise<Comment> => {
    const response = await api.patch<Comment>(`/comments/${id}`, data);
    return response.data;
  },

  /**
   * Delete a comment
   * @param id Comment ID
   */
  deleteComment: async (id: string): Promise<void> => {
    await api.delete(`/comments/${id}`);
  },

  /**
   * Get replies to a specific comment
   * @param commentId Parent comment ID
   * @param params Pagination parameters
   * @returns Paginated list of replies
   */
  getReplies: async (
    commentId: string,
    params?: PaginationParams
  ): Promise<PaginatedResponse<Comment>> => {
    const response = await api.get<PaginatedResponse<Comment>>(
      `/comments/${commentId}/replies`,
      { params }
    );
    return response.data;
  },

  /**
   * Reply to a comment
   * @param commentId Parent comment ID
   * @param content Reply content
   * @returns Created reply comment
   */
  replyToComment: async (
    commentId: string,
    content: string
  ): Promise<Comment> => {
    const parentComment = await commentService.getCommentById(commentId);
    
    const replyData: CreateCommentRequest = {
      content,
      targetType: parentComment.targetType,
      targetId: parentComment.targetId,
      parentCommentId: commentId,
    };
    
    return commentService.createComment(replyData);
  },

  /**
   * Get all comments by current user
   * @param params Pagination parameters
   * @returns Paginated list of user's comments
   */
  getMyComments: async (
    params?: PaginationParams
  ): Promise<PaginatedResponse<Comment>> => {
    const response = await api.get<PaginatedResponse<Comment>>(
      "/comments/me",
      { params }
    );
    return response.data;
  },
};

export default commentService;
