import { CreateUserTable1711782366740 } from './1711782366740-create-user-table';
import { CreateUserVerificationCodeTable1711782886894 } from './1711782886894-create-user-verification-code-table';
import { CreateKeywordTable1711925608107 } from './1711925608107-create-keyword-table';
import { AddIndexOnUserId1711926830090 } from './17119268300900-apply-index-user-id-on-keyword-table';

export const migrations = [
    CreateUserTable1711782366740,
    CreateUserVerificationCodeTable1711782886894,
    CreateKeywordTable1711925608107,
    AddIndexOnUserId1711926830090
];
