import { CreateUserTable1711782366740 } from './1711782366740-create-user-table';
import { CreateUserVerificationCodeTable1711782886894 } from './1711782886894-create-user-verification-code-table';
import { CreateKeywordTable1711925608107 } from './1711925608107-create-keyword-table';
import { AddIndexOnUserId1711926830090 } from './1711926830090-apply-index-user-id-on-keyword-table';
import { ChangeCreatedAtToTimestamp1711940999669 } from './1711940999669-change-created-at-keyword-datatype';

export const migrations = [
    CreateUserTable1711782366740,
    CreateUserVerificationCodeTable1711782886894,
    CreateKeywordTable1711925608107,
    AddIndexOnUserId1711926830090,
    ChangeCreatedAtToTimestamp1711940999669
];
