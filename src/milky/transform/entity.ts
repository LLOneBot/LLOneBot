import { FriendEntity, GroupEntity, GroupFileEntity, GroupFolderEntity, GroupMemberEntity } from '@saltify/milky-types';
import { CategoryFriend, Sex, SimpleInfo } from '@/ntqqapi/types';
import { GroupSimpleInfo, GroupMember, GroupFileInfo } from '@/ntqqapi/types';

export function transformGender(gender: Sex): 'male' | 'female' | 'unknown' {
    if (gender === Sex.Male) return 'male';
    if (gender === Sex.Female) return 'female';
    return 'unknown';
}

export function transformFriend(friend: SimpleInfo, category: CategoryFriend): FriendEntity {
    return {
        user_id: parseInt(friend.uin || friend.coreInfo.uin),
        nickname: friend.coreInfo.nick,
        sex: transformGender(friend.baseInfo?.sex ?? Sex.Unknown),
        qid: friend.baseInfo?.qid ?? '',
        remark: friend.coreInfo.remark ?? '',
        category: {
            category_id: category.categoryId,
            category_name: category.categroyName,
        },
    };
}

export function transformGroup(group: GroupSimpleInfo): GroupEntity {
    return {
        group_id: parseInt(group.groupCode),
        group_name: group.groupName,
        member_count: group.memberCount,
        max_member_count: group.maxMember,
    };
}

export function transformGroupMemberRole(role: number): GroupMemberEntity['role'] {
    if (role === 4) return 'owner';  // 群主
    if (role === 3) return 'admin';  // 管理员
    return 'member';
}

export function transformGroupMember(member: GroupMember): GroupMemberEntity {
    return {
        user_id: parseInt(member.uin),
        nickname: member.nick,
        sex: 'unknown',
        group_id: parseInt(member.uin),
        card: member.cardName ?? '',
        title: member.memberSpecialTitle ?? '',
        level: 0, // NTQQ doesn't provide level directly
        role: transformGroupMemberRole(member.role),
        join_time: member.joinTime,
        last_sent_time: member.lastSpeakTime,
        shut_up_end_time: member.shutUpTime,
    };
}

export function transformGroupFileList(
    groupId: number, 
    data: GroupFileInfo, 
    parentFolderId?: string
): { files: GroupFileEntity[]; folders: GroupFolderEntity[] } {
    const files: GroupFileEntity[] = [];
    const folders: GroupFolderEntity[] = [];
    
    if (!data.item || data.item.length === 0) {
        return { files, folders };
    }
    
    for (const item of data.item) {
        // Type 1 = File, Type 2 = Folder (based on common NTQQ patterns)
        // Also check isFolder flag in fileInfo
        if (item.type === 2 || (item.folderInfo && !item.fileInfo)) {
            // This is a folder
            if (item.folderInfo) {
                // Filter by parent folder if specified
                if (!parentFolderId || item.folderInfo.parentFolderId === parentFolderId) {
                    folders.push({
                        group_id: groupId,
                        folder_id: item.folderInfo.folderId,
                        parent_folder_id: item.folderInfo.parentFolderId || '/',
                        folder_name: item.folderInfo.folderName,
                        created_time: item.folderInfo.createTime,
                        last_modified_time: item.folderInfo.modifyTime || item.folderInfo.createTime,
                        creator_id: parseInt(item.folderInfo.createUin),
                        file_count: item.folderInfo.totalFileCount || 0,
                    });
                }
            }
        } else if (item.type === 1 || item.fileInfo) {
            // This is a file
            if (item.fileInfo) {
                // Filter by parent folder if specified
                if (!parentFolderId || item.fileInfo.parentFolderId === parentFolderId) {
                    files.push({
                        group_id: groupId,
                        file_id: item.fileInfo.fileId,
                        file_name: item.fileInfo.fileName,
                        parent_folder_id: item.fileInfo.parentFolderId || '/',
                        file_size: parseInt(item.fileInfo.fileSize),
                        uploaded_time: item.fileInfo.uploadTime,
                        expire_time: item.fileInfo.deadTime || 0,
                        uploader_id: parseInt(item.fileInfo.uploaderUin),
                        downloaded_times: item.fileInfo.downloadTimes || 0,
                    });
                }
            }
        }
    }
    
    return { files, folders };
}

