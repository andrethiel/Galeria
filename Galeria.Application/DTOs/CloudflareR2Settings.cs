using System;
using System.Collections.Generic;
using System.Text;

namespace Galeria.Application.DTOs
{
    public class CloudflareR2Settings
    {
        public string AccountId { get; set; }
        public string AccessKeyId { get; set; }
        public string SecretAccessKey { get; set; }
        public string BucketName { get; set; }
        public string URLApi { get; set; }
        public string URLApiDev { get; set; }
    }
}
