using System;
using System.Collections.Generic;
using System.Text;

namespace Galeria.Application.DTOs
{
    public class CloudflareR2Settings
    {
        public string AccountId { get; set; } = string.Empty;
        public string AccessKeyId { get; set; } = string.Empty;
        public string SecretAccessKey { get; set; } = string.Empty;
        public string BucketName { get; set; } = string.Empty;
    }
}
